"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";

// ---------------------------------------------------------------------------
// Navbar — mobile-first with hamburger menu
// ---------------------------------------------------------------------------

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Workflows", href: "/workflows" },
    { label: "Tools", href: "/tools" },
    { label: "Submit", href: "/submit" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ── Desktop / Mobile pill nav ─────────────────────────────────── */}
      <nav style={{
        position: "sticky",
        top: 16,
        zIndex: 100,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "0 16px",
        pointerEvents: "none",
      }}>
        <div className="glass-panel" style={{
          maxWidth: 760,
          width: "100%",
          display: "flex",
          alignItems: "center",
          height: 56,
          padding: "0 10px 0 16px",
          borderRadius: 999,
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
          pointerEvents: "auto",
          gap: 6,
        }}>
          {/* Logo */}
          <Link href="/" onClick={closeMenu} style={{
            textDecoration: "none",
            display: "flex", alignItems: "center", gap: 8,
            padding: 0, marginRight: 8, flexShrink: 0,
          }}>
            <div style={{
              width: 24, height: 24,
              background: "#000000",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 900, color: "white",
            }}>F</div>
            <span style={{
              fontWeight: 800, fontSize: 15,
              color: "#000000", letterSpacing: "-0.02em",
            }}>FlowBase</span>
          </Link>

          {/* Desktop nav links — hidden on mobile via CSS class */}
          <div className="nav-links" style={{ display: "flex", gap: 2, flex: 1 }}>
            {navItems.map(item => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} style={{
                  background: isActive ? "rgba(0, 0, 0, 0.05)" : "transparent",
                  color: isActive ? "#000000" : "rgba(0, 0, 0, 0.6)",
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                  whiteSpace: "nowrap",
                }}>{item.label}</Link>
              );
            })}
          </div>

          {/* Spacer on mobile so auth sits to the right of logo */}
          <div style={{ flex: 1 }} className="nav-mobile-spacer" />

          {/* Auth */}
          {isSignedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <Link href="/profile" className="nav-auth-label" style={{
                color: "rgba(0,0,0,0.6)", fontSize: 12, fontWeight: 700,
                textDecoration: "none", padding: "6px 10px", borderRadius: 999,
                whiteSpace: "nowrap",
              }}>My saves</Link>
              <UserButton />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="glass-button-primary" style={{
                borderRadius: 999, padding: "7px 16px",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                border: "none", flexShrink: 0, whiteSpace: "nowrap",
              }}>Sign in</button>
            </SignInButton>
          )}

          {/* Hamburger — shown on mobile via CSS */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{ marginLeft: 4 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect y="3" width="20" height="2" rx="1" fill="currentColor"/>
              <rect y="9" width="20" height="2" rx="1" fill="currentColor"/>
              <rect y="15" width="20" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* ── Mobile full-screen menu ──────────────────────────────────── */}
      <div className={`nav-mobile-menu ${menuOpen ? "open" : ""}`} role="dialog" aria-modal="true">
        <button
          className="nav-mobile-close"
          onClick={closeMenu}
          aria-label="Close menu"
        >×</button>

        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="nav-mobile-link"
            onClick={closeMenu}
          >{item.label}</Link>
        ))}

        {isSignedIn && (
          <Link href="/profile" className="nav-mobile-link" onClick={closeMenu}>
            My Profile
          </Link>
        )}

        <div style={{ marginTop: 24 }}>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button
                className="glass-button-primary"
                onClick={closeMenu}
                style={{
                  borderRadius: 14, padding: "14px 40px",
                  fontSize: 15, fontWeight: 700,
                  cursor: "pointer", border: "none",
                }}
              >Sign in</button>
            </SignInButton>
          )}
        </div>
      </div>
    </>
  );
}
