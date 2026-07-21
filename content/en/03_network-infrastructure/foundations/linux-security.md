---
title: "Linux Post-Exploitation: Enumeration and Privilege Escalation"
domain: network-infrastructure
category: "Post Exploitation"
tags: ["Linux", "Post Exploitation", "Privilege Escalation", "Enumeration", "Hardening"]
team: red
section: post-exploitation
type: knowledge
sourceTrack: netMaster
difficulty: medium
shortDescription: "A practical workflow for analyzing a Linux host after gaining access: users, sudo, file permissions, SUID, cron, PATH, logs, Docker, and security mechanisms"
updatedAt: "2026-07-21"
---

# Linux Post-Exploitation: Enumeration and Privilege Escalation

After gaining access to a Linux system as a low-privileged user, the next objective is to understand the environment and identify a path to higher privileges.

We do not begin by randomly launching kernel exploits.

First, we try to answer a few fundamental questions:

```text
Who am I?
Which groups do I belong to?
What is running as root?
What can I read?
What can I modify?
What will later be executed with higher privileges?
```

The most common privilege-escalation pattern looks like this:

```text
privileged process
        +
file, directory, or command controlled by a regular user
        =
potential privilege escalation
```

---

## Initial System Orientation

Start by collecting basic information about the current user, host, and operating system.

```bash
whoami
id
groups
hostname
uname -a
cat /etc/os-release
```

The most important information includes:

- the current user,
- UID and GID,
- supplementary groups,
- distribution version,
- kernel version,
- system architecture.

Example:

```text
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

This means that access was obtained in the context of a web server process.

We do not yet have administrative privileges, but the application process may have access to configuration files, secrets, local services, or files that can help with further escalation.

---

## Processes, Services, and Ports

Next, determine what is running on the host.

```bash
ps auxf
ss -tulnp
systemctl --type=service --state=running
```

Focus on:

- processes running as root,
- custom applications,
- automatically executed scripts,
- local services that were not visible during external scanning,
- processes using files that we can modify.

Example:

```text
LISTEN 0 128 0.0.0.0:22
LISTEN 0 128 127.0.0.1:3306
```

Port `22` is listening on all interfaces.

MySQL is listening only locally:

```text
127.0.0.1:3306
```

An external scan may not detect it, but after gaining a shell we can attempt to connect to the service locally.

```bash
mysql -h 127.0.0.1 -u root -p
```

---

## Users and Groups

Groups can grant additional privileges that are not obvious from the UID alone.

```bash
id
groups
```

Groups that deserve particular attention include:

```text
sudo
wheel
docker
lxd
disk
adm
shadow
systemd-journal
```

Example:

```text
uid=1000:user gid=1000:user groups=1000:user,999:docker
```

Membership in the `docker` group is often effectively equivalent to administrative access because the user can communicate with the privileged Docker daemon.

The `adm` group may provide access to logs containing usernames, internal paths, application errors, or secrets.

---

## Sudo Rules

One of the first mandatory checks is:

```bash
sudo -l
```

This command shows which programs the current user can execute with elevated privileges.

Example:

```text
user ALL=(ALL) NOPASSWD: /usr/bin/python3
```

Python can execute system commands, so this rule directly enables privilege escalation.

Minimal PoC:

```bash
sudo /usr/bin/python3 -c 'import os; os.system("/usr/bin/id")'
```

Expected result:

```text
uid=0(root) gid=0(root) groups=0(root)
```

This is enough to confirm the vulnerability without opening a persistent root shell.

### Dangerous Programs in sudoers

Programs requiring particular attention include:

```text
python
perl
ruby
find
vim
vi
less
more
man
awk
tar
rsync
nmap
gdb
docker
systemctl
service
env
```

A program may appear to be a normal editor, pager, or administrative utility while still supporting command execution.

Example rule:

```text
user ALL=(ALL) NOPASSWD: /usr/bin/find /var/log *
```

An administrator may assume that the user can only search logs.

However, `find` can execute external commands through `-exec`.

```bash
sudo /usr/bin/find /var/log -maxdepth 0 -exec /usr/bin/id \;
```

If the result shows UID `0`, the rule allows arbitrary command execution as root.

### Wildcards in sudoers

Rules containing `*` must be analyzed carefully.

A wildcard may allow:

- passing an additional argument,
- matching a different file,
- abusing a program option,
- manipulating a path,
- executing a different program than the administrator intended.

Do not analyze only the binary name.

Analyze the complete chain:

```text
program
+
allowed arguments
+
wildcards
+
permissions of input files
+
permissions of directories
```

---

## File and Directory Permissions

The basic Linux permission model is based on:

```text
u – owner
g – group
o – others
```

Available permissions:

```text
r – read
w – write
x – execute
```

Example:

```bash
ls -l /etc/passwd
```

```text
-rw-r--r-- 1 root root 2847 Jun 6 10:20 /etc/passwd
```

Interpretation:

```text
owner root – read and write
group root – read
others     – read
```

### Files with 777 Permissions

Find files that every user can read, modify, and execute:

```bash
find / -type f -perm 0777 2>/dev/null
```

Find files writable and executable by others:

```bash
find / -type f -perm -o=w -perm -o=x 2>/dev/null
```

Find root-owned files writable by everyone:

```bash
find / -type f -user root -perm -o=w 2>/dev/null
```

A writable file does not automatically mean privilege escalation.

The key question is:

> Will this file later be read or executed by a process running with higher privileges?

Files of particular interest include:

- scripts executed by root,
- service configuration files,
- backup scripts,
- deployment files,
- libraries,
- files executed by cron or systemd.

### Analyzing the Entire Path

Checking only the file itself is not enough.

```bash
namei -l /opt/scripts/backup.sh
```

`namei` displays the permissions of every directory in the path.

Example:

```text
drwxr-xr-x root root /
drwxr-xr-x root root opt
drwxrwxrwx root root scripts
-rwxr-xr-x root root backup.sh
```

The script itself is not writable, but the `scripts` directory has `777` permissions.

A user may therefore remove the original file and create a replacement with the same name.

---

## Ownerless Files

Linux stores file ownership as numeric UID and GID values.

If an account is deleted, a file may remain assigned to an identifier that no longer exists.

```bash
find / -xdev -nouser -nogroup 2>/dev/null
```

Example:

```text
-rw-rw-r-- 1 500 500 45 May 29 2017 /var/lib/test
```

If a user with UID `500` is later created, that user may automatically become the owner of the file.

Verification:

```bash
stat /var/lib/test
getent passwd 500
getent group 500
```

This finding is especially relevant when the file:

- contains credentials,
- is executed by a service,
- is part of a backup process,
- is located in an application directory,
- can be modified.

---

## SUID and SGID

The SUID bit causes a program to run with the effective UID of the file owner.

If the owner is root, the program may perform some operations with root privileges.

Find SUID files:

```bash
find / -type f -perm -4000 2>/dev/null
```

Find SGID files:

```bash
find / -type f -perm -2000 2>/dev/null
```

Find both:

```bash
find / -type f \( -perm -4000 -o -perm -2000 \) 2>/dev/null
```

Not every SUID file is vulnerable.

First, determine whether the binary is a standard system component.

```bash
ls -la /path/to/file
file /path/to/file
strings /path/to/file | less
ldd /path/to/file
```

Questions to answer:

```text
Does the program execute other commands?
Does it use absolute paths?
Does it accept filenames from the user?
Does it use environment variables?
Does it read a writable configuration file?
Is the binary listed in GTFOBins?
```

Custom binaries located in the following directories are especially interesting:

```text
/usr/local/bin
/opt
/home
```

---

## Linux Capabilities

Capabilities divide root privileges into smaller units.

A program may not have SUID set but may still receive a dangerous capability, such as:

```text
cap_setuid
cap_dac_read_search
cap_sys_admin
cap_net_raw
```

Find assigned capabilities:

```bash
getcap -r / 2>/dev/null
```

Example:

```text
/usr/bin/python3 = cap_setuid+ep
```

If an interpreter has `cap_setuid`, it may change the process UID to `0`.

Minimal PoC:

```bash
/usr/bin/python3 -c 'import os; os.setuid(0); os.system("/usr/bin/id")'
```

Expected result:

```text
uid=0(root) gid=1000(user)
```

Capabilities assigned to interpreters, editors, or programs that support code execution are particularly dangerous.

---

## Cron and System Tasks

Cron executes commands according to a defined schedule.

Important locations include:

```text
/etc/crontab
/etc/cron.d/
/etc/cron.hourly/
/etc/cron.daily/
/var/spool/cron/
/var/spool/cron/crontabs/
```

Basic analysis:

```bash
cat /etc/crontab
ls -la /etc/cron.d/
```

Combined search:

```bash
find /etc/cron* /var/spool/cron* \
  -type f \
  -exec ls -l {} \; \
  2>/dev/null
```

Example:

```text
* * * * * root /opt/cronjob/script.sh
```

Root executes the script every minute.

Check:

```bash
ls -la /opt/cronjob/script.sh
namei -l /opt/cronjob/script.sh
```

A vulnerability exists when a regular user can:

- modify the script,
- replace it with another file,
- modify the parent directory,
- influence files used by the script,
- replace a command executed without an absolute path.

### systemd Timers

Not every recurring task uses cron.

```bash
systemctl list-timers --all
```

For an interesting task:

```bash
systemctl cat name.timer
systemctl cat name.service
```

Inspect the `ExecStart` field and the permissions of the referenced file.

---

## PATH Hijacking

The `$PATH` variable defines the directories in which the system searches for programs executed without a full path.

```bash
echo "$PATH"
```

Example:

```text
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

If a privileged script executes:

```bash
tar -czf backup.tar.gz /var/www
```

instead of:

```bash
/usr/bin/tar -czf backup.tar.gz /var/www
```

the system searches for `tar` in the directories listed in `$PATH`.

If an attacker controls a directory listed before `/usr/bin`, they may place a malicious file named `tar` there.

A particularly dangerous configuration is:

```bash
export PATH=.:$PATH
```

The dot represents the current directory.

The system first attempts to execute:

```text
./tar
```

and only later:

```text
/usr/bin/tar
```

### Exploitation Conditions

PATH hijacking requires several conditions:

```text
the process runs with higher privileges,
it executes a command without an absolute path,
the attacker controls a directory listed in PATH,
the environment does not reset PATH securely.
```

Analyze scripts with:

```bash
grep -RniE \
  '(^|[;&|[:space:]])(cp|mv|tar|bash|sh|python|find|cat|ls)([[:space:]]|$)' \
  /usr/local/bin /opt 2>/dev/null
```

Look for programs executed without full paths.

---

## Command History and Secrets

Shell history may contain:

```text
passwords,
tokens,
API keys,
connection strings,
internal addresses,
administrative commands,
backup paths.
```

Check:

```bash
cat ~/.bash_history 2>/dev/null
cat ~/.zsh_history 2>/dev/null
history
```

User profiles:

```bash
cat ~/.bashrc
cat ~/.zshrc
cat ~/.profile
cat ~/.bash_profile
```

Search for secrets:

```bash
grep -RniE \
  'pass|password|token|secret|api[_-]?key|authorization|bearer' \
  ~/ 2>/dev/null
```

Hidden files:

```bash
ls -la
```

A filename beginning with a dot is not protected.

It is merely hidden from the default output of `ls`.

Profile files may contain:

- environment variables,
- credentials,
- aliases,
- `$PATH` modifications,
- automatically executed scripts,
- references to other files.

---

## Environment Variables

Applications often store configuration and secrets in environment variables.

```bash
env
printenv
```

Look for names such as:

```text
DB_PASSWORD
DATABASE_URL
API_KEY
JWT_SECRET
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
TOKEN
```

Process environment variables can sometimes also be read through `/proc`.

```bash
tr '\0' '\n' < /proc/<PID>/environ
```

Access depends on permissions and system configuration.

If an application process running as the same user contains database or API credentials, they may allow access to another system or support further privilege escalation.

---

## Log Analysis

Logs help reconstruct system activity, but they may also reveal misconfigurations.

Common locations:

```text
/var/log/syslog
/var/log/auth.log
/var/log/messages
/var/log/secure
/var/log/audit/audit.log
```

Basic commands:

```bash
tail -f /var/log/syslog
grep sshd /var/log/auth.log
journalctl -xe
journalctl -f
```

Logs for a specific service:

```bash
journalctl -u nginx
journalctl -u ssh
journalctl -u sshd
```

Logs from a specific time range:

```bash
journalctl --since "1 hour ago"
journalctl --since yesterday
```

Logs from the current boot:

```bash
journalctl -b
```

Logs may reveal:

- failed application commands,
- missing files,
- paths executed through sudo,
- errors in root-owned scripts,
- usernames,
- internal IP addresses,
- SELinux or AppArmor denials.

### Example: Discovering a Potential Escalation Path

```text
sudo: www-data :
command not found ;
PWD=/var/www/html ;
USER=root ;
COMMAND=/usr/local/bin/deploy_script
```

Related `sudoers` rule:

```text
www-data ALL=(ALL) NOPASSWD: /usr/local/bin/deploy_*
```

Check:

```bash
ls -la /usr/local/bin/
ls -ld /usr/local/bin
sudo -l
```

The key question is:

> Can `www-data` create a file matching the `deploy_*` pattern?

The log does not automatically confirm the vulnerability, but it provides a precise hypothesis to test.

---

## Auditd

`auditd` monitors operations performed on the system.

It can record:

- process execution,
- file access,
- configuration changes,
- user activity,
- authentication attempts.

Status:

```bash
systemctl status auditd
```

Active rules:

```bash
auditctl -l
```

Default log:

```text
/var/log/audit/audit.log
```

Search for events associated with a key:

```bash
ausearch -k passwd_watch
```

Executions of a specific program:

```bash
ausearch -x /bin/bash
```

Actions performed by UID `1000`:

```bash
ausearch -ua 1000
```

Summary reports:

```bash
aureport --summary
aureport -x --summary
aureport -au
```

Example entry:

```text
comm="apache2"
exe="/usr/sbin/apache2"
uid=33
name="/etc/shadow"
```

The Apache process running as UID `33` accessed `/etc/shadow`.

Possible hypotheses:

```text
LFI or Path Traversal,
operating system command execution,
a web shell,
a vulnerable administrative script,
local reconnaissance after application compromise.
```

---

## SELinux

SELinux adds Mandatory Access Control on top of standard `rwx` permissions.

It may block an operation even when traditional file permissions allow it.

Status:

```bash
sestatus
getenforce
```

Modes:

| Mode         | Behavior                              |
| ------------ | ------------------------------------- |
| `Enforcing`  | blocks unauthorized operations        |
| `Permissive` | logs violations without blocking them |
| `Disabled`   | SELinux is disabled                   |

File contexts:

```bash
ls -Z
```

Restore the default context:

```bash
restorecon -Rv /var/www/html
```

Analyze denials:

```bash
ausearch -m AVC
audit2why -a
audit2allow -w -a
```

From a pentester's perspective, SELinux may:

- block vulnerability exploitation,
- restrict a compromised process,
- leave a detailed record of attempted actions.

`Permissive` mode does not block operations, but it may still log the activity.

---

## AppArmor

AppArmor is an alternative Mandatory Access Control mechanism commonly used in Ubuntu and Debian.

Status:

```bash
aa-status
```

Modes:

| Mode       | Behavior                                   |
| ---------- | ------------------------------------------ |
| `Enforce`  | the profile blocks unauthorized operations |
| `Complain` | operations are logged but not blocked      |
| `Disabled` | the profile is disabled                    |

Determine:

- whether AppArmor is active,
- which processes have profiles,
- which profiles are in `enforce` mode,
- which profiles are only in `complain` mode,
- whether the compromised application is protected.

`Complain` mode may look like active protection, but it does not actually block operations.

---

## Docker

Access to the Docker Engine often means the host can be compromised.

Basic checks:

```bash
docker version
docker ps
id
```

If the user belongs to the following group:

```text
docker
```

they can usually communicate with the daemon running as root.

Check the socket:

```bash
ls -la /var/run/docker.sock
```

Also look for a remotely exposed Docker API.

```bash
nmap -p 2375 <host>
```

If the port is open:

```bash
curl http://<host>:2375/version
```

A publicly exposed API without authentication allows remote container management.

### Container Analysis

```bash
docker ps -a
docker images
docker inspect <container>
```

Look for:

- `privileged` mode,
- host filesystem mounts,
- `/var/run/docker.sock` mounts,
- `--pid=host`,
- secrets in environment variables,
- processes running as root,
- excessive capabilities.

Check mounts:

```bash
docker inspect \
  --format '{{json .Mounts}}' \
  <container>
```

Check privileged mode:

```bash
docker inspect \
  --format '{{.HostConfig.Privileged}}' \
  <container>
```

Membership in the `docker` group should be treated as administrative access.

---

## Kernel and Local Exploits

Kernel vulnerabilities may allow local privilege escalation.

Well-known historical examples include:

```text
Dirty COW
CVE-2016-5195

PwnKit
CVE-2021-4034
```

Before testing an exploit, collect:

```bash
uname -a
cat /etc/os-release
dpkg -l
rpm -qa
```

The kernel version alone is not enough.

Linux distributions often backport security fixes without changing the main version number.

A useful helper tool is:

```bash
linux-exploit-suggester
```

Its output is a list of potential candidates, not confirmed vulnerabilities.

A kernel exploit should be one of the final stages of analysis.

Check these areas first:

```text
sudo,
SUID and SGID,
capabilities,
cron and timers,
writable files,
privileged groups,
Docker,
secrets,
PATH hijacking.
```

Misconfigurations are usually easier to verify, safer, and more predictable than kernel exploits.

---

## Automated Enumeration

Automated tools can speed up analysis.

One of the most popular is LinPEAS.

```bash
chmod +x linpeas.sh
./linpeas.sh
```

Alternatively:

```bash
bash linpeas.sh
```

LinPEAS may identify:

- custom SUID binaries,
- capabilities,
- sudo rules,
- writable files,
- cron jobs,
- secrets,
- containers,
- potentially vulnerable software versions.

However, the output is not a ready-made vulnerability report.

Every finding requires manual verification.

Example:

```text
LinPEAS reports a writable file owned by root.
```

Verification:

```bash
ls -la /path
namei -l /path
file /path
grep -R "/path" /etc /opt /usr/local 2>/dev/null
```

Only then determine whether the file is executed, imported, or used by a privileged process.

---

## Local Enumeration Workflow

Basic commands after gaining a shell:

```bash
whoami
id
groups
sudo -l
```

System information:

```bash
hostname
uname -a
cat /etc/os-release
```

Processes and services:

```bash
ps auxf
ss -tulnp
systemctl --type=service --state=running
```

SUID, SGID, and capabilities:

```bash
find / -type f -perm -4000 2>/dev/null
find / -type f -perm -2000 2>/dev/null
getcap -r / 2>/dev/null
```

Cron and timers:

```bash
cat /etc/crontab
ls -la /etc/cron.d/
systemctl list-timers --all
```

History and secrets:

```bash
ls -la ~
cat ~/.bash_history 2>/dev/null
cat ~/.zsh_history 2>/dev/null
env
```

Security mechanisms:

```bash
getenforce 2>/dev/null
aa-status 2>/dev/null
```

Docker:

```bash
docker ps 2>/dev/null
ls -la /var/run/docker.sock 2>/dev/null
```

Finally, run automated enumeration and compare its output with the manual analysis.

---

## Minimal PoC

A good PoC confirms the impact without making unnecessary changes to the system.

Instead of opening a root shell, execute:

```bash
/usr/bin/id
```

Example for a vulnerable sudo rule:

```bash
sudo /usr/bin/find /var/log \
  -maxdepth 0 \
  -exec /usr/bin/id \;
```

Result:

```text
uid=0(root) gid=0(root) groups=0(root)
```

This result confirms command execution as root.

There is no need to:

- create a new account,
- modify `/etc/sudoers`,
- install a backdoor,
- leave behind an SUID binary,
- maintain persistent access.

---

## Documenting the Vulnerability

A finding should describe the complete mechanism.

### Observation

```text
The www-data user can execute /usr/bin/find through sudo without providing a password.
```

### Evidence

```bash
sudo -l
```

```text
www-data ALL=(ALL) NOPASSWD: /usr/bin/find /var/log *
```

### Interpretation

`find` supports command execution through the `-exec` option.

The `sudoers` rule therefore does not restrict the user to searching the `/var/log` directory.

### PoC

```bash
sudo /usr/bin/find /var/log \
  -maxdepth 0 \
  -exec /usr/bin/id \;
```

```text
uid=0(root) gid=0(root) groups=0(root)
```

### Impact

An attacker who gains access to the `www-data` account can execute arbitrary commands as root, resulting in complete compromise of the system.

### Recommendation

- remove the ability to execute `find` through sudo,
- replace it with a dedicated wrapper script,
- strictly restrict allowed arguments,
- avoid wildcards,
- review all `NOPASSWD` rules,
- monitor sudo usage.

---

## Hardening

The most important measures for reducing privilege-escalation risk include:

```text
regular updates,
a minimal number of services,
no unnecessary listening ports,
strict sudo rules,
no root-executed scripts writable by low-privileged users,
review of cron jobs and timers,
review of SUID, SGID, and capabilities,
restricted access to the Docker Engine,
SELinux or AppArmor in enforcement mode,
centralized and protected logs,
secure secret storage.
```

Useful control commands:

```bash
ss -tulnp
systemctl list-unit-files --state=enabled
sudo -l
find / -type f -perm -4000 2>/dev/null
getcap -r / 2>/dev/null
systemctl list-timers --all
getenforce
aa-status
```

---

## Mental Model

During local system analysis, remember:

```text
WHO
Who am I and which groups do I belong to?

WHAT
What is running as root?

WRITE
What can I modify?

EXECUTE
What will later be executed?

TRUST
Which privileged process trusts a resource
that I can control?
```

The most important pattern is:

```text
privileged process
        +
resource controlled by a lower-privileged user
        =
potential privilege escalation
```

Do not look only for a ready-made exploit.

Look for a misplaced trust boundary.
