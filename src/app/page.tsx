"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CATEGORIES } from "@/lib/data";
import { WorkflowCard } from "@/components/WorkflowCard";



export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Live data from Convex — undefined while loading, array when ready
  const allWorkflows = useQuery(api.workflows.getAll) ?? [];

  const filtered = activeCategory === "All"
    ? allWorkflows
    : allWorkflows.filter((w) => w.category === activeCategory);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Hero Section */}
      <div style={{
        padding: "120px 24px 80px",
        textAlign: "center",
        position: "relative",
      }}>
        {/* Floating stamp or mini-pill */}
        <div className="glass-panel font-mono" style={{ 
          display: "inline-block", 
          borderRadius: 999, 
          padding: "6px 16px", 
          fontSize: 11, 
          fontWeight: 700, 
          color: "#000", 
          border: "1px solid rgba(0,0,0,0.08)",
          background: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.02)",
          marginBottom: 28,
        }}>
          ✦ 200+ playbooks & counting
        </div>

        <h1 className="font-sans" style={{
          fontSize: "clamp(36px, 6vw, 68px)", 
          fontWeight: 800, 
          color: "#000000",
          lineHeight: 1.1, 
          marginBottom: 28, 
          letterSpacing: "-0.04em",
        }}>
          The playbook for using AI,<br />
          <span className="font-serif" style={{ fontStyle: "italic", fontWeight: 700 }}>not just finding it.</span>
        </h1>

        <p style={{ 
          fontSize: 18, 
          color: "#334155", 
          maxWidth: 580, 
          margin: "0 auto 40px", 
          lineHeight: 1.7 
        }}>
          Curated AI workflows, copy-paste prompts, and step-by-step guides — built for how people actually work.
        </p>

        {/* Buttons matching Diabrowser (Solid black + Frosted glass secondary) */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/workflows" className="glass-button-primary" style={{
            borderRadius: 14, 
            padding: "16px 36px", 
            fontSize: 15, 
            fontWeight: 700,
            textDecoration: "none",
          }}>Browse Workflows</Link>
          
          <Link href="/tools" className="glass-button" style={{
            borderRadius: 14, 
            padding: "16px 36px", 
            fontSize: 15, 
            fontWeight: 700,
            textDecoration: "none", 
            display: "inline-flex", 
            alignItems: "center"
          }}>Explore Tools</Link>
        </div>

        {/* Minimalist Stats Row */}
        <div style={{ display: "flex", gap: 50, justifyContent: "center", marginTop: 72, flexWrap: "wrap" }}>
          {[["200+", "Workflows"], ["50+", "AI Tools"], ["12k+", "Saves"], ["4", "Categories"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div className="font-serif" style={{ fontSize: 32, fontWeight: 700, color: "#000000" }}>{n}</div>
              <div className="font-mono" style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", fontWeight: 700, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Pills (Floating pill layout) */}
      <div style={{ padding: "16px 24px 0", maxWidth: 1080, margin: "0 auto" }}>
        <div className="glass-panel" style={{ 
          display: "flex", 
          gap: 6, 
          flexWrap: "wrap", 
          justifyContent: "center",
          padding: "8px",
          borderRadius: 999,
          maxWidth: "fit-content",
          margin: "0 auto",
          border: "1px solid rgba(0,0,0,0.06)",
        }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} className="glass-button" style={{
                background: isActive ? "#000000" : "transparent",
                color: isActive ? "#ffffff" : "rgba(0,0,0,0.6)",
                borderColor: "transparent",
                borderRadius: 999, 
                padding: "8px 20px",
                fontSize: 13.5, 
                fontWeight: 700, 
                cursor: "pointer",
                boxShadow: "none"
              }}>{cat}</button>
            )
          })}
        </div>
      </div>

      {/* Featured Workflows Grid */}
      <div style={{ padding: "50px 24px 100px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <h2 className="font-serif" style={{ fontSize: 28, fontWeight: 700, color: "#000000", margin: 0 }}>
              {activeCategory === "All" ? "Featured Workflows" : `${activeCategory} Workflows`}
            </h2>
            <div className="font-mono" style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", marginTop: 6, fontWeight: 700 }}>01 // CURATED PLAYBOOKS</div>
          </div>
          <Link href="/workflows" className="font-mono" style={{
            background: "none", 
            border: "none", 
            color: "#5863EA",
            fontSize: 12, 
            fontWeight: 700, 
            cursor: "pointer", 
            textDecoration: "none",
            display: "flex", 
            alignItems: "center", 
            gap: 6
          }}>View all <span>→</span></Link>
        </div>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24,
        }}>
          {filtered.map(w => <WorkflowCard key={w._id} workflow={w} />)}
        </div>
      </div>

      {/* CTA Banner (Huge rounded corners + Diabrowser elegant stamp stamp layout) */}
      <div className="glass-panel" style={{ 
        margin: "0 24px 100px", 
        borderRadius: "var(--radius-editorial)", 
        padding: "80px 24px", 
        textAlign: "center", 
        position: "relative", 
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.03)"
      }}>
        <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "50%", height: "200%", background: "radial-gradient(ellipse, rgba(88,99,234,0.05) 0%, rgba(255,255,255,0) 70%)", pointerEvents: "none" }}></div>
        
        <div style={{ position: "relative", zIndex: 2 }}>
          <h2 className="font-serif" style={{ color: "#000000", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Ready for a better way?
          </h2>
          <p style={{ color: "#475569", fontSize: 16, marginBottom: 36, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.6 }}>
            Share your custom workflow with 12,000+ AI practitioners and get community feedback.
          </p>
          <Link href="/submit" className="glass-button-primary" style={{
            borderRadius: 14, 
            padding: "16px 36px", 
            fontSize: 15,
            fontWeight: 700, 
            cursor: "pointer", 
            display: "inline-block", 
            textDecoration: "none"
          }}>Submit a Workflow</Link>
        </div>
      </div>
    </div>
  );
}
