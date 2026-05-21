"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { WorkflowCard } from "@/components/WorkflowCard";

export default function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const toolName = decodeURIComponent(slug);

  const workflows = useQuery(api.workflows.getByTool, { toolName });

  if (workflows === undefined) {
    return (
      <div style={{ padding: "100px 24px", display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div className="font-mono" style={{ fontSize: 11, color: "#5863EA", fontWeight: 700 }}>LOADING...</div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px 100px", position: "relative", zIndex: 1 }}>
      <Link href="/tools" className="glass-button font-mono" style={{
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
      }}>← BACK TO DIRECTORY</Link>
      
      <div className="font-mono" style={{ fontSize: 11, color: "#5863EA", fontWeight: 700, marginBottom: 8 }}>
        ✦ TOOL SPOTLIGHT
      </div>
      
      <h1 className="font-serif" style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 700, color: "#000000", marginBottom: 12, letterSpacing: "-0.02em" }}>
        Workflows using {toolName}
      </h1>
      
      <p style={{ color: "rgba(0, 0, 0, 0.6)", marginBottom: 40, fontSize: 16 }}>
        Discover playbooks that leverage {toolName} in their stack.
      </p>

      <div className="card-grid">
        {workflows.map(w => <WorkflowCard key={w._id} workflow={w} />)}
        {workflows.length === 0 && (
          <div className="glass-panel" style={{ gridColumn: "1/-1", textAlign: "center", padding: "100px 0", borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🔍</div>
            <div className="font-serif" style={{ fontSize: 20, fontWeight: 700, color: "#000000", marginBottom: 8 }}>No playbooks found</div>
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.5)" }}>Be the first to submit a workflow using {toolName}!</div>
            <Link href="/submit" className="glass-button-primary" style={{ marginTop: 24, display: "inline-block", textDecoration: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 13 }}>Submit a Workflow</Link>
          </div>
        )}
      </div>
    </div>
  );
}
