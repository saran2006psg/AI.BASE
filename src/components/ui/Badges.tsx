"use client";

import React from "react";

const difficultyConfig: Record<string, { color: string, bg: string, border: string, dot: string }> = {
  Beginner:     { color: "#16a34a", bg: "rgba(22, 163, 74, 0.08)", border: "rgba(22, 163, 74, 0.15)", dot: "#22c55e" },
  Intermediate: { color: "#d97706", bg: "rgba(217, 119, 6, 0.08)", border: "rgba(217, 119, 6, 0.15)", dot: "#f59e0b" },
  Advanced:     { color: "#dc2626", bg: "rgba(220, 38, 38, 0.08)", border: "rgba(220, 38, 38, 0.15)", dot: "#ef4444" },
};

const categoryColors: Record<string, { bg: string, color: string, border: string }> = {
  Marketing:   { bg: "rgba(88, 99, 234, 0.08)", color: "#5863EA", border: "rgba(88, 99, 234, 0.18)" },
  Research:    { bg: "rgba(29, 78, 216, 0.08)", color: "#1d4ed8", border: "rgba(29, 78, 216, 0.15)" },
  Coding:      { bg: "rgba(21, 128, 61, 0.08)", color: "#15803d", border: "rgba(21, 128, 61, 0.15)" },
  Productivity:{ bg: "rgba(194, 65, 12, 0.08)", color: "#c2410c", border: "rgba(194, 65, 12, 0.15)" },
  Writing:     { bg: "rgba(126, 34, 206, 0.08)", color: "#7e22ce", border: "rgba(126, 34, 206, 0.15)" },
  Design:      { bg: "rgba(157, 23, 77, 0.08)", color: "#9d174d", border: "rgba(157, 23, 77, 0.15)" },
};

export function DifficultyBadge({ level }: { level: string }) {
  const c = difficultyConfig[level] || difficultyConfig.Beginner;
  return (
    <span className="font-mono" style={{
      display: "inline-flex", 
      alignItems: "center", 
      gap: 5,
      background: c.bg, 
      color: c.color,
      border: `1px solid ${c.border}`,
      borderRadius: 999, 
      fontSize: 9.5, 
      fontWeight: 700,
      padding: "2px 8px", 
      letterSpacing: "0.08em", 
      textTransform: "uppercase",
      backdropFilter: "blur(4px)"
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {level}
    </span>
  );
}

export function CategoryBadge({ cat }: { cat: string }) {
  const c = categoryColors[cat] || { bg: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.6)", border: "rgba(0,0,0,0.08)" };
  return (
    <span className="font-mono" style={{
      background: c.bg, 
      color: c.color, 
      border: `1px solid ${c.border}`,
      borderRadius: 999, 
      fontSize: 9.5, 
      fontWeight: 700,
      padding: "2px 8px", 
      letterSpacing: "0.08em", 
      textTransform: "uppercase",
      backdropFilter: "blur(4px)"
    }}>{cat}</span>
  );
}

export function ToolBadge({ name }: { name: string }) {
  return (
    <span className="font-mono" style={{
      background: "rgba(255, 255, 255, 0.8)", 
      border: "1px solid rgba(0, 0, 0, 0.06)",
      borderRadius: 6, 
      fontSize: 9, 
      fontWeight: 700,
      color: "rgba(0, 0, 0, 0.5)", 
      padding: "3px 8px", 
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      backdropFilter: "blur(4px)"
    }}>{name}</span>
  );
}
