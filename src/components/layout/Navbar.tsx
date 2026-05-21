"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const navItems = [
    { label: "Workflows", href: "/workflows" },
    { label: "Tools", href: "/tools" },
    { label: "Submit", href: "/submit" },
  ];

  return (
    <nav style={{
      position: "sticky",
      top: 16,
      zIndex: 100,
      width: "100%",
      display: "flex",
      justifyContent: "center",
      padding: "0 24px",
      pointerEvents: "none",
    }}>
      <div className="glass-panel" style={{
        maxWidth: 760,
        width: "100%",
        display: "flex",
        alignItems: "center",
        height: 56,
        padding: "0 10px 0 20px",
        borderRadius: 999,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
        pointerEvents: "auto",
        gap: 8,
      }}>
        {/* Logo */}
        <Link href="/" style={{
          background: "none", border: "none", cursor: "pointer", textDecoration: "none",
          display: "flex", alignItems: "center", gap: 8, padding: 0, marginRight: 16, flexShrink: 0,
        }}>
          <div style={{
            width: 24, height: 24,
            background: "#000000",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 900, color: "white",
          }}>F</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#000000", letterSpacing: "-0.02em" }}>FlowBase</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 2, flex: 1 }}>
          {navItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} style={{
                background: isActive ? "rgba(0, 0, 0, 0.05)" : "transparent",
                color: isActive ? "#000000" : "rgba(0, 0, 0, 0.6)",
                border: "none",
                borderRadius: 999,
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
              }}>{item.label}</Link>
            );
          })}
        </div>

        {/* Auth section */}
        {isSignedIn ? (
          <>
            <Link href="/profile" style={{
              color: "rgba(0,0,0,0.6)",
              fontSize: 12,
              fontWeight: 700,
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: 999,
              flexShrink: 0,
            }}>My saves</Link>
            <UserButton />
          </>
        ) : (
          <SignInButton mode="modal">
            <button className="glass-button-primary" style={{
              borderRadius: 999,
              padding: "8px 20px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              flexShrink: 0,
            }}>Sign in</button>
          </SignInButton>
        )}
      </div>
    </nav>
  );
}
