"use client";

export function Footer() {
  return (
    <footer style={{ 
      background: "transparent", 
      color: "rgba(0, 0, 0, 0.6)", 
      padding: "48px 24px", 
      borderTop: "1px solid rgba(0,0,0,0.06)",
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{ 
        maxWidth: 1080, 
        margin: "0 auto", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        flexWrap: "wrap", 
        gap: 24,
      }}>
        {/* Left: Minimalist Monogram Logo and tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, 
            background: "#000000",
            borderRadius: "50%", 
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 900, color: "#ffffff",
          }}>F</div>
          <div className="font-mono" style={{ fontSize: 12, fontWeight: 800, color: "#000000", letterSpacing: "0.05em" }}>FLOWBASE</div>
          <span style={{ color: "rgba(0,0,0,0.15)", fontSize: 12 }}>|</span>
          <span className="font-mono" style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", fontWeight: 700, letterSpacing: "0.05em" }}>CURATED AI PLAYBOOKS</span>
        </div>

        {/* Right: Copyrights and Location Credit */}
        <div style={{ display: "flex", gap: 20, fontSize: 10, color: "rgba(0,0,0,0.4)" }}>
          <span className="font-mono" style={{ fontWeight: 700, letterSpacing: "0.05em" }}>© 2025 FLOWBASE</span>
          <span className="font-mono" style={{ fontWeight: 700, color: "rgba(0,0,0,0.3)", letterSpacing: "0.05em" }}>( EST. 2025 // NY )</span>
        </div>
      </div>
    </footer>
  );
}
