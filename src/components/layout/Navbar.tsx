"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
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
      pointerEvents: "none", /* Avoid intercepting click on overlay edges */
    }}>
      <div className="glass-panel" style={{
        maxWidth: 720,
        width: "100%",
        display: "flex", 
        alignItems: "center", 
        height: 56, 
        padding: "0 10px 0 20px",
        borderRadius: 999,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
        pointerEvents: "auto", /* Re-enable pointer events for the pill itself */
      }}>
        {/* Logo matching Diabrowser (Small clean circle symbol) */}
        <Link href="/" style={{
          background: "none", border: "none", cursor: "pointer", textDecoration: "none",
          display: "flex", alignItems: "center", gap: 8, padding: 0, marginRight: 24,
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

        {/* Floating Pill Nav links */}
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

        {/* Auth (Small premium black pill CTA) */}
        <button className="glass-button-primary" style={{
          borderRadius: 999, 
          padding: "8px 20px",
          fontSize: 12, 
          fontWeight: 700, 
          cursor: "pointer", 
          border: "none"
        }}>Sign in</button>
      </div>
    </nav>
  );
}
