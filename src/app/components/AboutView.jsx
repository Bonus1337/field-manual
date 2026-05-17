import React, { useEffect, useState } from "react";
import {
  Terminal,
  Shield,
  Crosshair,
  ExternalLink,
  Award,
  Target,
  Radar,
  Link2,
  Code2,
  BrainCircuit,
  BadgeCheck,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { T, ts } from "../constants/theme";
import { getAboutCopy } from "../constants/aboutCopy";
import {
  EXPERIENCE,
  CERTIFICATIONS,
  SKILL_CLUSTERS,
  ABOUT_LINKS,
} from "../constants/aboutData";

const ICONS = { Crosshair, Award, BadgeCheck, Link2, Target, Radar };

const CERT_PRESETS = {
  gold: { color: "#e2a84b", dim: "#e2a84b10", border: "#e2a84b33" },
  sekurak: { color: "#c0392b", dim: "#c0392b10", border: "#c0392b33" },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

function BlinkingCursor() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      style={{
        display: "inline-block",
        width: "9px",
        height: "16px",
        background: visible ? T.acc : "transparent",
        verticalAlign: "middle",
        marginLeft: "4px",
      }}
    />
  );
}

function SekurakInsiderBadge({ insider, isMobile }) {
  return (
    <div
      style={{
        border: `1px solid ${T.acc}44`,
        background: T.acc + "08",
        borderRadius: "2px",
        padding: isMobile ? "20px 18px" : "24px 28px",
        marginBottom: isMobile ? "48px" : "64px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "180px",
          height: "100%",
          background: `radial-gradient(ellipse at top right, ${T.acc}12, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "46px",
            height: "46px",
            border: `1px solid ${T.acc}55`,
            background: T.acc + "18",
            borderRadius: "2px",
            flexShrink: 0,
          }}
        >
          <Star size={20} color={T.acc} fill={T.acc + "cc"} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                fontFamily: T.mono,
                fontSize: "14px",
                fontWeight: 700,
                color: T.acc,
                letterSpacing: "0.04em",
              }}
            >
              {insider.title}
            </span>
            <span
              style={{
                fontFamily: T.mono,
                fontSize: "9px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: T.acc,
                border: `1px solid ${T.acc}44`,
                padding: "2px 8px",
                borderRadius: "2px",
                background: T.acc + "10",
              }}
            >
              {insider.badge}
            </span>
          </div>

          <p
            style={{
              fontSize: "13px",
              color: T.text,
              lineHeight: 1.8,
              margin: "0 0 8px",
              maxWidth: "600px",
            }}
          >
            {insider.descBefore}
            <a
              href={insider.descLinkHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: T.acc,
                textDecoration: "underline",
                textDecorationStyle: "dotted",
              }}
            >
              {insider.descLinkLabel}
            </a>
            {insider.descAfter}
          </p>

          <div style={{ fontFamily: T.mono, fontSize: "10px", color: T.textMuted }}>
            {insider.sub}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceCard({
  role,
  company,
  period,
  duration,
  tags,
  bullets,
  accent,
  isMobile,
  expand,
  collapse,
}) {
  const [expanded, setExpanded] = useState(false);
  const hasBullets = bullets?.length > 0;
  return (
    <div style={{ borderBottom: `1px solid ${T.border}`, padding: "20px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: T.textBright,
              marginBottom: "4px",
            }}
          >
            {role}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontSize: "12px", color: accent }}>{company}</span>
            <span style={{ color: T.textDim }}>·</span>
            <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textMuted }}>
              {period}
            </span>
            {duration && (
              <>
                <span style={{ color: T.textDim }}>·</span>
                <span
                  style={{ fontFamily: T.mono, fontSize: "10px", color: T.textMuted }}
                >
                  {duration}
                </span>
              </>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: T.mono,
                  fontSize: "9px",
                  color: T.textMuted,
                  border: `1px solid ${T.border}`,
                  padding: "2px 7px",
                  borderRadius: "2px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {hasBullets && (
          <button
            onClick={() => setExpanded((e) => !e)}
            style={{
              fontFamily: T.mono,
              fontSize: "9px",
              color: T.textMuted,
              background: "none",
              border: `1px solid ${T.border}`,
              padding: "4px 9px",
              cursor: "pointer",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            {expanded ? collapse : expand}
          </button>
        )}
      </div>

      {expanded && hasBullets && (
        <div
          style={{
            marginTop: "12px",
            paddingLeft: "14px",
            borderLeft: `2px solid ${T.border}`,
          }}
        >
          {bullets.map((b, i) => (
            <div
              key={i}
              style={{
                fontSize: "12px",
                color: T.textMuted,
                lineHeight: 1.75,
                padding: "3px 0",
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: T.acc, flexShrink: 0, marginTop: "2px" }}>›</span>
              {b}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CertBadge({ label, issuer, sub, year, preset, icon }) {
  const { color, dim, border } = CERT_PRESETS[preset] ?? CERT_PRESETS.gold;
  const Icon = ICONS[icon];
  return (
    <div
      style={{
        padding: "16px 18px",
        border: `1px solid ${border}`,
        background: dim,
        borderRadius: "2px",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" }}
      >
        {Icon && <Icon size={13} color={color} />}
        <span
          style={{
            fontFamily: T.mono,
            fontSize: "11px",
            fontWeight: 700,
            color,
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{ fontSize: "12px", color: T.text, fontWeight: 500, marginBottom: "2px" }}
      >
        {issuer}
      </div>
      {sub && (
        <div style={{ fontSize: "11px", color: T.textMuted, marginBottom: "5px" }}>
          {sub}
        </div>
      )}
      <div style={{ fontFamily: T.mono, fontSize: "9px", color: T.textDim }}>
        cleared · {year}
      </div>
    </div>
  );
}

function SkillCluster({ heading, Icon, color, skills }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          marginBottom: "10px",
        }}
      >
        {Icon && React.createElement(Icon, { size: 12, color })}
        <span
          style={{ fontFamily: T.mono, fontSize: "10px", color, letterSpacing: "0.08em" }}
        >
          {heading}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {skills.map((s) => (
          <span
            key={s}
            style={{
              fontFamily: T.mono,
              fontSize: "10px",
              color: T.textMuted,
              border: `1px solid ${T.border}`,
              padding: "3px 9px",
              borderRadius: "2px",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function LinkCard({ href, icon, label, handle, accentColor }) {
  const [hovered, setHovered] = useState(false);
  const Icon = ICONS[icon];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "14px 18px",
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        background: hovered ? T.bgCard : "transparent",
        borderRadius: "2px",
        textDecoration: "none",
        transition: "all 0.12s",
      }}
    >
      {Icon && (
        <Icon
          size={15}
          color={hovered ? accentColor : T.textMuted}
          style={{ flexShrink: 0 }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: hovered ? T.textBright : T.text,
            transition: "color 0.12s",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: "10px",
            color: T.textMuted,
            marginTop: "2px",
          }}
        >
          {handle}
        </div>
      </div>
      <ExternalLink size={10} color={T.textDim} style={{ flexShrink: 0 }} />
    </a>
  );
}

export function AboutView({ safeLang = "pl" }) {
  const isMobile = useIsMobile();
  const copy = getAboutCopy(safeLang);

  const redTeam = ts("red");
  const blueTeam = ts("blue");
  const neutral = ts("neutral");

  const teamColor = {
    red: redTeam.color,
    blue: blueTeam.color,
    neutral: neutral.color,
    acc: T.acc,
  };

  const experienceWithAccent = (EXPERIENCE[safeLang] ?? EXPERIENCE.pl).map((e) => ({
    ...e,
    accent: teamColor[e.team] ?? neutral.color,
  }));

  const skillClusters = SKILL_CLUSTERS.map((cluster) => ({
    ...cluster,
    heading: copy.skills[cluster.key],
    color: teamColor[cluster.key] ?? T.acc,
    Icon: { red: Crosshair, blue: Shield, dev: Code2, ai: BrainCircuit }[cluster.key],
  }));

  const resolvedLinks = ABOUT_LINKS.map((link) => ({
    ...link,
    accentColor: link.accent === "acc" ? T.acc : (teamColor[link.accent] ?? T.acc),
  }));

  return (
    <div
      style={{
        background: T.bg,
        fontFamily: T.mono,
        minHeight: "100%",
        color: T.text,
        minWidth: 0,
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          padding: isMobile ? "10px 16px" : "10px 36px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "11px",
          color: T.textMuted,
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <Terminal size={12} style={{ color: T.acc, flexShrink: 0 }} />
        <span style={{ color: T.acc }}>$</span>
        <span>{copy.terminal}</span>
        <span style={{ color: T.border, margin: "0 6px" }}>·</span>
        <span>{copy.terminalSub}</span>
      </div>

      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: isMobile ? "32px 16px 80px" : "52px 36px 100px",
        }}
      >
        <section style={{ marginBottom: isMobile ? "44px" : "60px" }}>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: T.textMuted,
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "20px",
                height: "1px",
                background: T.acc,
              }}
            />
            {copy.sectionLabel}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                border: `1px solid ${T.acc}44`,
                background: T.acc + "10",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: T.mono,
                fontSize: "15px",
                fontWeight: 700,
                color: T.acc,
                borderRadius: "2px",
                flexShrink: 0,
                letterSpacing: "0.04em",
              }}
            >
              MS
            </div>
            <div>
              <div
                style={{
                  fontFamily: T.mono,
                  fontSize: "11px",
                  color: T.acc,
                  letterSpacing: "0.12em",
                  marginBottom: "2px",
                }}
              >
                Bonus1337
              </div>
              <div style={{ fontSize: "12px", color: T.textMuted }}>
                Maciej Szymański · {copy.location}
              </div>
            </div>
          </div>

          <h1
            style={{
              fontFamily: T.serif || "Georgia, serif",
              fontSize: isMobile ? "30px" : "clamp(30px, 4vw, 50px)",
              fontWeight: 400,
              color: T.textBright,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              margin: "0 0 20px",
            }}
          >
            {copy.headline1}
            <br />
            {copy.headline2}
            <BlinkingCursor />
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: T.text,
              lineHeight: 1.85,
              maxWidth: "640px",
              margin: "0 0 22px",
            }}
          >
            {copy.bio}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {[
              {
                label: copy.pills.soc,
                color: blueTeam.color,
                border: blueTeam.border,
                dim: blueTeam.dim,
              },
              {
                label: copy.pills.insider,
                color: T.acc,
                border: T.accBorder,
                dim: T.accDim,
              },
              {
                label: copy.pills.certs,
                color: "#e2a84b",
                border: "#e2a84b33",
                dim: "#e2a84b10",
              },
              {
                label: copy.pills.ai,
                color: neutral.color,
                border: neutral.border,
                dim: neutral.dim,
              },
            ].map((p) => (
              <span
                key={p.label}
                style={{
                  fontFamily: T.mono,
                  fontSize: "10px",
                  fontWeight: 600,
                  color: p.color,
                  border: `1px solid ${p.border}`,
                  background: p.dim,
                  padding: "3px 10px",
                  borderRadius: "2px",
                  letterSpacing: "0.05em",
                }}
              >
                {p.label}
              </span>
            ))}
          </div>
        </section>

        <SekurakInsiderBadge insider={copy.insider} isMobile={isMobile} />

        <section style={{ marginBottom: isMobile ? "48px" : "64px" }}>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: T.textMuted,
              marginBottom: "16px",
            }}
          >
            {copy.sections.certs}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: "10px",
            }}
          >
            {CERTIFICATIONS.map((c) => (
              <CertBadge key={c.label + c.sub} {...c} />
            ))}
          </div>
          <div
            style={{
              marginTop: "10px",
              padding: "10px 14px",
              border: `1px dashed ${T.border}`,
              borderRadius: "2px",
              fontFamily: T.mono,
              fontSize: "10px",
              color: T.textDim,
            }}
          >
            <span style={{ color: T.acc }}>+</span> {copy.sections.certNote}
          </div>
        </section>

        <section style={{ marginBottom: isMobile ? "48px" : "64px" }}>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: T.textMuted,
              marginBottom: "4px",
            }}
          >
            {copy.sections.experience}
          </div>
          <div style={{ borderTop: `1px solid ${T.border}` }}>
            {experienceWithAccent.map((e) => (
              <ExperienceCard
                key={e.role + e.company}
                {...e}
                isMobile={isMobile}
                expand={copy.ui.expand}
                collapse={copy.ui.collapse}
              />
            ))}
          </div>
        </section>

        <section style={{ marginBottom: isMobile ? "48px" : "64px" }}>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: T.textMuted,
              marginBottom: "20px",
            }}
          >
            {copy.sections.skills}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: "28px",
            }}
          >
            {skillClusters.map((c) => (
              <SkillCluster key={c.key} {...c} />
            ))}
          </div>
        </section>

        <section style={{ marginBottom: isMobile ? "48px" : "64px" }}>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: T.textMuted,
              marginBottom: "4px",
            }}
          >
            {copy.sections.philosophy}
          </div>
          <div style={{ borderTop: `1px solid ${T.border}` }}>
            {copy.philosophy.map((line) => (
              <div
                key={line.prefix}
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "13px 0",
                  borderBottom: `1px solid ${T.border}`,
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontFamily: T.mono,
                    fontSize: "10px",
                    color: teamColor[line.team],
                    flexShrink: 0,
                    paddingTop: "2px",
                    minWidth: "86px",
                  }}
                >
                  {line.prefix}
                </span>
                <span style={{ fontSize: "13px", color: T.text, lineHeight: 1.7 }}>
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: T.textMuted,
              marginBottom: "14px",
            }}
          >
            {copy.sections.contact}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: "10px",
              marginBottom: "28px",
            }}
          >
            {resolvedLinks.map((link) => (
              <LinkCard key={link.href} {...link} />
            ))}
          </div>

          <div
            style={{
              padding: "20px 22px",
              border: `1px dashed ${T.border}`,
              borderRadius: "2px",
            }}
          >
            <div
              style={{
                fontFamily: T.mono,
                fontSize: "10px",
                color: T.textMuted,
                marginBottom: "10px",
              }}
            >
              {copy.ui.finalPrompt}
            </div>
            <p
              style={{
                fontSize: "13px",
                color: T.text,
                lineHeight: 1.8,
                margin: 0,
                maxWidth: "580px",
              }}
            >
              {copy.ui.finalNote}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
