"use client";

import React, { useState } from "react";

export function SaveButton({ count, saved, onToggle }: { count: number, saved: boolean, onToggle: (e: React.MouseEvent) => void }) {
  return (
    <button className="glass-button" onClick={onToggle} style={{
      display: "inline-flex", 
      alignItems: "center", 
      gap: 6,
      background: saved ? "rgba(88, 99, 234, 0.08)" : "rgba(255, 255, 255, 0.8)",
      color: saved ? "#5863EA" : "rgba(0, 0, 0, 0.5)",
      border: `1px solid ${saved ? "rgba(88, 99, 234, 0.3)" : "rgba(0, 0, 0, 0.08)"}`,
      borderRadius: 999, 
      padding: "8px 18px",
      fontSize: 13, 
      fontWeight: 700, 
      cursor: "pointer",
      transition: "all 0.2s ease",
    }}>
      <span style={{ fontSize: 14 }}>{saved ? "♥" : "♡"}</span>
      {count + (saved ? 1 : 0)}
    </button>
  );
}

export function CopyBlock({ code, label }: { code: string, label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ 
      borderRadius: 16, 
      overflow: "hidden", 
      border: "1px solid rgba(0, 0, 0, 0.08)", 
      marginBottom: 20, 
      background: "rgba(255, 255, 255, 0.5)", 
      backdropFilter: "blur(12px)", 
      boxShadow: "0 4px 20px rgba(0,0,0,0.01)" 
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.8)", 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center", 
        padding: "10px 18px", 
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      }}>
        <span className="font-mono" style={{ color: "#5863EA", fontSize: 11, fontWeight: 700 }}>{label}</span>
        
        <button className="glass-button font-mono" onClick={copy} style={{
          background: copied ? "rgba(74, 222, 128, 0.08)" : "rgba(255, 255, 255, 0.8)",
          color: copied ? "#16a34a" : "rgba(0, 0, 0, 0.5)",
          border: `1px solid ${copied ? "rgba(74, 222, 128, 0.2)" : "rgba(0, 0, 0, 0.08)"}`,
          borderRadius: 6, 
          padding: "4px 10px",
          fontSize: 10, 
          cursor: "pointer", 
          fontWeight: 700,
        }}>{copied ? "✓ COPIED" : "COPY"}</button>
      </div>
      
      <pre style={{
        color: "#1a1a1a", 
        margin: 0,
        padding: "20px", 
        fontSize: 13, 
        lineHeight: 1.7,
        overflowX: "auto", 
        fontFamily: "var(--font-mono), monospace",
      }}>{code}</pre>
    </div>
  );
}

export function Accordion({ steps }: { steps: Array<{title: string, content: string}> }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {steps.map((step, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="glass-card" style={{
            borderColor: isOpen ? "rgba(88, 99, 234, 0.25)" : "rgba(0, 0, 0, 0.08)",
            borderRadius: 16, 
            overflow: "hidden",
            background: isOpen ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.55)",
            boxShadow: isOpen ? "0 10px 30px rgba(0, 0, 0, 0.03)" : "none"
          }}>
            <button onClick={() => setOpen(isOpen ? null : i)} style={{
              width: "100%", 
              display: "flex", 
              alignItems: "center", 
              gap: 14,
              padding: "16px 20px", 
              background: "none", 
              border: "none",
              cursor: "pointer", 
              textAlign: "left",
            }}>
              <span className="font-mono" style={{
                width: 26, 
                height: 26, 
                borderRadius: "50%", 
                flexShrink: 0,
                background: isOpen ? "#000000" : "rgba(0, 0, 0, 0.05)",
                color: isOpen ? "white" : "rgba(0, 0, 0, 0.5)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                fontSize: 11, 
                fontWeight: 700, 
                transition: "all 0.2s",
              }}>{String(i + 1).padStart(2, "0")}</span>
              
              <span className="font-sans" style={{ 
                fontWeight: 700, 
                fontSize: 15, 
                color: isOpen ? "#000000" : "rgba(0,0,0,0.8)", 
                flex: 1 
              }}>{step.title}</span>
              
              <span style={{
                color: "rgba(0,0,0,0.3)", 
                fontSize: 16, 
                transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isOpen ? "rotate(180deg)" : "none",
              }}>▾</span>
            </button>
            {isOpen && (
              <div style={{ 
                padding: "0 20px 20px 60px", 
                fontSize: 14.5, 
                color: "rgba(0, 0, 0, 0.7)", 
                lineHeight: 1.7 
              }}>
                {step.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  );
}
