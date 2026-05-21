"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";


export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Live data from Convex
  const allTools = useQuery(api.tools.getAll) ?? [];
  const cats = ["All", ...Array.from(new Set(allTools.map((t) => t.category)))];
  const filtered = activeCategory === "All" ? allTools : allTools.filter((t) => t.category === activeCategory);

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px 100px", position: "relative", zIndex: 1 }}>
      <div className="font-mono" style={{ fontSize: 11, color: "#5863EA", fontWeight: 700, marginBottom: 8 }}>
        ✦ DIRECTORY // CURATED UTILITIES
      </div>
      
      <h1 className="font-serif" style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 700, color: "#000000", marginBottom: 12, letterSpacing: "-0.02em" }}>
        Tool Directory
      </h1>
      
      <p style={{ color: "rgba(0, 0, 0, 0.6)", marginBottom: 40, fontSize: 16 }}>
        The best AI tools, structured by where they belong in production pipelines.
      </p>

      {/* Categories Floating Pill Bar */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 44 }}>
        <div className="glass-panel" style={{ 
          display: "flex", 
          gap: 4, 
          flexWrap: "wrap",
          padding: "6px",
          borderRadius: 999,
          border: "1px solid rgba(0, 0, 0, 0.06)",
        }}>
          {cats.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} className="glass-button" style={{
                background: isActive ? "#000000" : "transparent",
                color: isActive ? "#ffffff" : "rgba(0, 0, 0, 0.6)",
                borderColor: "transparent",
                borderRadius: 999, 
                padding: "6px 14px",
                fontSize: 13, 
                fontWeight: 700, 
                cursor: "pointer",
                boxShadow: "none"
              }}>{cat}</button>
            )
          })}
        </div>
      </div>

      {/* Grid of clean off-white tools cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {filtered.map(tool => (
          <div key={tool._id} className="glass-card" style={{
            padding: "28px",
            display: "flex", 
            flexDirection: "column",
            borderRadius: 24,
            border: "1px solid rgba(0, 0, 0, 0.08)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, 
                  height: 44, 
                  borderRadius: 12, 
                  background: "rgba(0, 0, 0, 0.03)",
                  border: "1px solid rgba(0, 0, 0, 0.06)", 
                  display: "flex", 
                  alignItems: "center",
                  justifyContent: "center", 
                  fontSize: 22, 
                }}>{tool.emoji}</div>
                
                <div>
                  <h3 className="font-serif" style={{ fontWeight: 800, fontSize: 16, color: "#000000", margin: 0 }}>{tool.name}</h3>
                  <div className="font-mono" style={{ fontSize: 9.5, color: "#5863EA", fontWeight: 700, marginTop: 4 }}>{tool.category}</div>
                </div>
              </div>
            </div>
            
            <p style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.7)", lineHeight: 1.6, marginBottom: 24, flex: 1, margin: 0 }}>
              {tool.description}
            </p>
            
            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="glass-button font-mono" style={{
              display: "inline-flex", 
              alignItems: "center", 
              gap: 6, 
              justifyContent: "center",
              fontSize: 10, 
              fontWeight: 700, 
              color: "#5863EA", 
              borderRadius: 10, 
              padding: "10px",
              textDecoration: "none", 
              width: "100%", 
              boxSizing: "border-box"
            }}
              onClick={e => e.stopPropagation()}
            >VISIT SITE ↗</a>
          </div>
        ))}
      </div>
    </div>
  );
}
