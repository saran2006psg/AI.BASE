"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { CATEGORIES, DIFFICULTIES } from "@/lib/data";
import { WorkflowCard } from "@/components/WorkflowCard";


export default function WorkflowsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [sort, setSort] = useState("Most Saved");

  // Live data from Convex
  const allWorkflows = useQuery(api.workflows.getAll) ?? [];

  const filtered = allWorkflows
    .filter((w) => {
      const matchSearch =
        w.title.toLowerCase().includes(search.toLowerCase()) ||
        w.summary.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || w.category === category;
      const matchDiff = difficulty === "All" || w.difficulty === difficulty;
      return matchSearch && matchCat && matchDiff;
    })
    .sort((a, b) => {
      if (sort === "Most Saved") return b.saveCount - a.saveCount;
      if (sort === "Newest") return b._creationTime - a._creationTime;
      return b.saveCount - a.saveCount;
    });

  return (
    <div className="page-container" style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px 100px", position: "relative", zIndex: 1 }}>
      <div className="font-mono" style={{ fontSize: 11, color: "#5863EA", fontWeight: 700, marginBottom: 8 }}>
        ✦ INDEX // SYSTEMATIC PLAYBOOKS
      </div>
      
      <h1 className="font-serif" style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 700, color: "#000000", marginBottom: 12, letterSpacing: "-0.02em" }}>
        Workflow Library
      </h1>
      
      <p style={{ color: "rgba(0, 0, 0, 0.6)", marginBottom: 40, fontSize: 16 }}>
        Step-by-step AI workflows, curated and verified.
      </p>

      {/* Search (Modern, clean, floating) */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "#5863EA", fontSize: 16 }}>🔍</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search workflows..."
          className="glass-input"
          style={{
            width: "100%", 
            padding: "16px 16px 16px 50px",
            borderRadius: 16, 
            fontSize: 15, 
            boxSizing: "border-box",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.01)",
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40, alignItems: "center" }}>
        <div className="glass-panel pill-row" style={{ 
          padding: "6px",
          borderRadius: 999,
          border: "1px solid rgba(0, 0, 0, 0.06)",
          flex: "1 1 auto",
          minWidth: 0,
        }}>
          {CATEGORIES.map(cat => {
            const isActive = category === cat;
            return (
              <button key={cat} onClick={() => setCategory(cat)} className="glass-button" style={{
                background: isActive ? "#000000" : "transparent",
                color: isActive ? "#ffffff" : "rgba(0, 0, 0, 0.6)",
                borderColor: "transparent",
                borderRadius: 999, 
                padding: "6px 14px",
                fontSize: 13, 
                fontWeight: 700, 
                cursor: "pointer",
                boxShadow: "none",
                flexShrink: 0,
              }}>{cat}</button>
            )
          })}
        </div>
        
        {/* Selects — full width row on mobile */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flexShrink: 0 }}>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="glass-input font-mono" style={{
            borderRadius: 12, 
            padding: "10px 14px",
            fontSize: 11, 
            fontWeight: 700,
            cursor: "pointer", 
            appearance: "none",
            border: "1px solid rgba(0, 0, 0, 0.08)",
          }}>
            {DIFFICULTIES.map(d => <option key={d} value={d} style={{ background: "#ffffff", color: "#000000" }}>{d.toUpperCase()}</option>)}
          </select>
          
          <select value={sort} onChange={e => setSort(e.target.value)} className="glass-input font-mono" style={{
            borderRadius: 12, 
            padding: "10px 14px",
            fontSize: 11, 
            fontWeight: 700,
            cursor: "pointer", 
            appearance: "none",
            border: "1px solid rgba(0, 0, 0, 0.08)",
          }}>
            {["Most Saved", "Newest", "Trending"].map(s => <option key={s} value={s} style={{ background: "#ffffff", color: "#000000" }}>{s.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      <div className="font-mono" style={{ color: "#5863EA", fontSize: 11, fontWeight: 700, marginBottom: 24 }}>
        {filtered.length} PLAYBOOKS FOUND
      </div>

      {/* Grid of clean frosted cards */}
      <div className="card-grid">
        {filtered.map(w => <WorkflowCard key={w._id} workflow={w} />)}
        {filtered.length === 0 && (
          <div className="glass-panel" style={{ gridColumn: "1/-1", textAlign: "center", padding: "100px 0", borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🔍</div>
            <div className="font-serif" style={{ fontSize: 20, fontWeight: 700, color: "#000000", marginBottom: 8 }}>No playbooks found</div>
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.5)" }}>Try refining your search terms or filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}
