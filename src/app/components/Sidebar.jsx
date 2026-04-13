import React from "react";
import { Search, X, Terminal, ChevronRight, Home } from "lucide-react";
import { T, ts } from "../constants/theme";
import { SITE } from "../constants/config";
import { DocButton } from "./DocButton";
import { GroupToggle } from "./GroupToggle";

export function Sidebar({
  isDesktop,
  sidebarOpen,
  onCloseSidebar,
  query,
  onQueryChange,
  t,
  safeLang,
  onSwitchLang,
  onGoDoc,
  isHome,
  currentDocId,
  pinned,
  sectionsList,
  openSections,
  openGroups,
  toggleSection,
  toggleGroup,
  isSearching,
}) {
  const renderDocList = (items) =>
    items.map((item) => (
      <DocButton
        key={item.id}
        item={item}
        isActive={item.id === currentDocId}
        onGoDoc={onGoDoc}
      />
    ));

  return (
    <>
      {!isDesktop && sidebarOpen && (
        <div
          onClick={onCloseSidebar}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 30,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      <aside
        style={{
          position: isDesktop ? "static" : "fixed",
          inset: isDesktop ? "auto" : "0 auto 0 0",
          zIndex: isDesktop ? "auto" : 40,
          width: "272px",
          flexShrink: 0,
          background: T.bgSidebar,
          borderRight: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease",
        }}
      >
        <div
          style={{
            padding: "16px 16px 12px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => onGoDoc("home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: `1px solid ${T.border}`,
                background: T.bgCard,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Terminal size={15} style={{ color: T.gen }} />
            </div>

            <div style={{ textAlign: "left", minWidth: 0 }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: T.textBright,
                  fontFamily: T.mono,
                }}
              >
                field-manual
              </div>
              <div style={{ fontSize: "10px", color: T.textMuted }}>
                by {SITE.authorLabel}
              </div>
            </div>
          </button>

          {!isDesktop && (
            <button
              onClick={onCloseSidebar}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: T.textMuted,
                padding: "4px",
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ padding: "12px 12px 8px", flexShrink: 0 }}>
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <Search
              size={13}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: T.textMuted,
                pointerEvents: "none",
              }}
            />

            <input
              id="kb-search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t.search}
              style={{
                width: "100%",
                padding: "7px 10px 7px 30px",
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: "4px",
                color: T.textBright,
                fontFamily: T.mono,
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
                caretColor: T.gen,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = T.borderHover)}
              onBlur={(e) => (e.currentTarget.style.borderColor = T.border)}
            />
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={onSwitchLang}
              style={{
                flex: 1,
                padding: "5px 8px",
                borderRadius: "4px",
                border: `1px solid ${T.border}`,
                background: "transparent",
                color: T.textMuted,
                fontFamily: T.mono,
                fontSize: "10px",
                cursor: "pointer",
                letterSpacing: "0.06em",
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.textBright)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
            >
              {safeLang === "pl" ? "EN" : "PL"}
            </button>

            <a
              href={SITE.repoUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                padding: "5px 8px",
                borderRadius: "4px",
                border: `1px solid ${T.border}`,
                background: "transparent",
                color: T.textMuted,
                fontFamily: T.mono,
                fontSize: "10px",
                textDecoration: "none",
                letterSpacing: "0.06em",
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.textBright)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.textMuted)}
            >
              GitHub
            </a>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 8px 24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <button
              onClick={() => onGoDoc("home")}
              style={{
                width: "100%",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "7px 10px",
                borderRadius: "4px",
                background: isHome ? "rgba(255,255,255,0.04)" : "none",
                borderLeft: `2px solid ${isHome ? T.gen : "transparent"}`,
                border: "none",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <Home
                size={12}
                style={{ color: isHome ? T.gen : T.textMuted, flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: "11px",
                  color: isHome ? T.textBright : T.textMuted,
                  fontFamily: T.mono,
                  letterSpacing: "0.08em",
                }}
              >
                FEED
              </span>
            </button>
          </div>

          {pinned?.length ? (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  padding: "0 10px 6px",
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  color: T.textMuted,
                  fontWeight: 600,
                }}
              >
                {t.start}
              </div>

              {pinned.map((item) => (
                <DocButton
                  key={item.id}
                  item={item}
                  isActive={item.id === currentDocId}
                  onGoDoc={onGoDoc}
                />
              ))}
            </div>
          ) : null}

          {sectionsList.map((sec) => {
            const m2 = ts(sec.team);
            const isOpen = isSearching ? true : Boolean(openSections[sec.key]);

            return (
              <div key={sec.key} style={{ marginBottom: "18px" }}>
                <button
                  onClick={() => toggleSection(sec.key)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "5px 10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontFamily: T.mono,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      minWidth: 0,
                    }}
                  >
                    <ChevronRight
                      size={11}
                      style={{
                        color: T.textMuted,
                        transition: "transform 0.15s",
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        flexShrink: 0,
                      }}
                    />

                    <span
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.14em",
                        fontWeight: 700,
                        color: T.textMuted,
                        textTransform: "uppercase",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sec.sectionLabel}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      fontWeight: 700,
                      color: m2.color,
                      flexShrink: 0,
                      background: `${m2.color}18`,
                      border: `1px solid ${m2.border}`,
                      borderRadius: "3px",
                      padding: "2px 5px",
                    }}
                  >
                    {m2.label}
                  </span>
                </button>

                {isOpen && (
                  <div style={{ paddingLeft: "4px" }}>
                    {sec.subsArr?.map((sub) => {
                      const subOpen = isSearching ? true : Boolean(openGroups[sub.key]);
                      const isPsWU = sub.kind === "portswigger-writeups";

                      return (
                        <div key={sub.key}>
                          {sub.label ? (
                            <GroupToggle
                              label={sub.label}
                              count={sub.countOverride ?? sub.items.length}
                              isOpen={subOpen}
                              onToggle={() => toggleGroup(sub.key)}
                              indentLevel={0}
                            />
                          ) : null}

                          {(sub.label ? subOpen : true) && (
                            <div style={{ paddingLeft: sub.label ? "12px" : "0" }}>
                              {!isPsWU && renderDocList(sub.items)}

                              {isPsWU &&
                                sec.writeups?.topicsArr?.map((topic) => {
                                  const topicOpen = isSearching
                                    ? true
                                    : Boolean(openGroups[topic.key]);

                                  return (
                                    <div key={topic.key}>
                                      <GroupToggle
                                        label={topic.label}
                                        count={
                                          topic.diffsArr?.reduce(
                                            (a, g) => a + g.items.length,
                                            0
                                          ) ?? 0
                                        }
                                        isOpen={topicOpen}
                                        onToggle={() => toggleGroup(topic.key)}
                                        indentLevel={0}
                                      />

                                      {topicOpen &&
                                        topic.diffsArr?.map((g) => {
                                          const gOpen = isSearching
                                            ? true
                                            : Boolean(openGroups[g.key]);

                                          return (
                                            <div
                                              key={g.key}
                                              style={{ paddingLeft: "10px" }}
                                            >
                                              <GroupToggle
                                                label={g.label}
                                                count={g.items.length}
                                                isOpen={gOpen}
                                                onToggle={() => toggleGroup(g.key)}
                                                indentLevel={0}
                                              />

                                              {gOpen && (
                                                <div style={{ paddingLeft: "10px" }}>
                                                  {renderDocList(g.items)}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {sec.groupsArr?.map((g) => {
                      const gOpen = isSearching ? true : Boolean(openGroups[g.key]);

                      return (
                        <div key={g.key}>
                          <GroupToggle
                            label={g.label}
                            count={g.items.length}
                            isOpen={gOpen}
                            onToggle={() => toggleGroup(g.key)}
                          />
                          {gOpen && (
                            <div style={{ paddingLeft: "16px" }}>
                              {renderDocList(g.items)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div
          style={{
            padding: "10px 14px 12px",
            borderTop: `1px solid ${T.border}`,
            flexShrink: 0,
            fontSize: "10px",
            color: T.textMuted,
            fontFamily: T.mono,
          }}
        >
          <span style={{ color: T.gen }}>$</span> built by{" "}
          <span style={{ color: T.text }}>{SITE.authorLabel}</span>
        </div>
      </aside>
    </>
  );
}
