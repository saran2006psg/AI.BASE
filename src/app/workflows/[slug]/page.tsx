"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CategoryBadge, DifficultyBadge } from "@/components/ui/Badges";
import { SaveButton, Accordion, CopyBlock } from "@/components/ui/Interactive";
import { CommentsSection } from "@/components/CommentsSection";

function SectionHeader({ icon, label }: { icon: string, label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <h2 className="font-serif" style={{ fontSize: 20, fontWeight: 700, color: "#000000", margin: 0, letterSpacing: "-0.01em" }}>{label}</h2>
    </div>
  );
}

export default function WorkflowDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // Live fetch from Convex by slug
  const workflow = useQuery(api.workflows.getBySlug, { slug });
  const [saved, setSaved] = useState(false);

  // Loading state
  if (workflow === undefined) {
    return (
      <div className="glass-panel" style={{ padding: 60, textAlign: "center", margin: "40px auto", maxWidth: 400, borderRadius: 16 }}>
        <div className="font-mono" style={{ fontSize: 11, color: "#5863EA", fontWeight: 700 }}>LOADING PLAYBOOK...</div>
      </div>
    );
  }

  if (!workflow) return <div className="glass-panel" style={{ padding: 60, textAlign: "center", margin: "40px auto", maxWidth: 400, borderRadius: 16 }}>Workflow not found.</div>;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px 120px", position: "relative", zIndex: 1 }}>
      {/* Back Button (Diabrowser Style) */}
      <Link href="/workflows" className="glass-button font-mono" style={{
        textDecoration: "none", 
        borderRadius: 999, 
        padding: "8px 18px",
        fontSize: 10, 
        fontWeight: 700, 
        marginBottom: 36,
        display: "inline-flex", 
        alignItems: "center", 
        gap: 6,
        color: "#5863EA",
      }}>← BACK TO INDEX</Link>

      {/* Header Block */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
          <CategoryBadge cat={workflow.category} />
          <DifficultyBadge level={workflow.difficulty} />
          
          <span className="glass-badge font-mono" style={{ 
            fontSize: 10, 
            display: "flex", 
            alignItems: "center", 
            gap: 6, 
            borderRadius: 999, 
            padding: "3px 12px", 
            fontWeight: 700 
          }}>
            ⏱ LAST TESTED: {workflow.lastTested.toUpperCase()}
          </span>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
          <h1 className="font-serif" style={{ 
            fontSize: "clamp(28px, 6vw, 42px)", 
            fontWeight: 700, 
            color: "#000000", 
            lineHeight: 1.15, 
            letterSpacing: "-0.03em", 
            flex: 1, 
            margin: 0 
          }}>
            {workflow.title}
          </h1>
          
          <SaveButton count={workflow.saveCount} saved={saved} onToggle={() => setSaved(!saved)} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
        {/* Problem */}
        <section>
          <SectionHeader icon="🎯" label="What pain this solves" />
          <p className="glass-card font-sans" style={{ 
            fontSize: 15.5, 
            color: "rgba(0, 0, 0, 0.75)", 
            lineHeight: 1.8, 
            padding: "28px", 
            margin: 0,
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.01)"
          }}>
            {workflow.problem}
          </p>
        </section>

        {/* Tools */}
        <section>
          <SectionHeader icon="🛠" label="Tools required" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {workflow.tools.map((t: string) => (
              <span key={t} className="glass-button font-mono" style={{
                borderRadius: 10, 
                padding: "8px 16px",
                fontSize: 11, 
                fontWeight: 700, 
                color: "#000000",
              }}>{t}</span>
            ))}
          </div>
        </section>

        {/* Steps (Editorial Step-by-step layout) */}
        <section>
          <SectionHeader icon="📋" label="Step-by-step instructions" />
          <Accordion steps={workflow.steps} />
        </section>

        {/* Prompts */}
        <section>
          <SectionHeader icon="💬" label="Prompt templates" />
          {workflow.prompts.map((p: any, i: number) => <CopyBlock key={i} code={p.code} label={p.label} />)}
        </section>

        {/* Mistakes (Diabrowser warning style) */}
        <section>
          <SectionHeader icon="⚠️" label="Common mistakes & fixes" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {workflow.mistakes.map((m: string, i: number) => (
              <div key={i} className="font-sans" style={{
                background: "rgba(0, 0, 0, 0.02)",
                borderLeft: "4px solid #000000", /* Thick black line indicator on left */
                borderTop: "1px solid rgba(0,0,0,0.05)",
                borderRight: "1px solid rgba(0,0,0,0.05)",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                borderRadius: "0 12px 12px 0", 
                padding: "20px 24px",
                fontSize: 14.5, 
                color: "rgba(0, 0, 0, 0.8)", 
                lineHeight: 1.7,
                display: "flex", 
                gap: 12, 
                alignItems: "flex-start",
              }}>
                <span style={{ flexShrink: 0, marginTop: 2, fontSize: 15 }}>⚡</span>
                {m}
              </div>
            ))}
          </div>
        </section>

        {/* Comments Section */}
        <section>
          <CommentsSection workflowId={workflow._id} />
        </section>
      </div>
    </div>
  );
}
