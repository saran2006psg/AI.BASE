"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { WorkflowCard } from "@/components/WorkflowCard";

// ---------------------------------------------------------------------------
// Status badge for submissions
// ---------------------------------------------------------------------------
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    published: { bg: "rgba(34, 197, 94, 0.1)", color: "#16a34a", label: "✓ Published" },
    pending: { bg: "rgba(234, 179, 8, 0.1)", color: "#ca8a04", label: "⏳ Pending Review" },
    draft: { bg: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.5)", label: "Draft" },
    rejected: { bg: "rgba(220, 38, 38, 0.08)", color: "#dc2626", label: "✗ Rejected" },
  };
  const style = map[status] ?? map.draft;
  return (
    <span className="font-mono" style={{
      background: style.bg, color: style.color,
      borderRadius: 999, padding: "3px 12px", fontSize: 9.5, fontWeight: 700,
    }}>{style.label}</span>
  );
}

// ---------------------------------------------------------------------------
// Profile Page
// ---------------------------------------------------------------------------
export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [tab, setTab] = useState<"saves" | "submissions">("saves");

  const savedWorkflows = useQuery(api.saves.getSavedWorkflows);
  const mySubmissions = useQuery(api.workflows.getBySubmitter);

  // ── Loading ──
  if (!isLoaded) {
    return (
      <div style={{ padding: "100px 24px", display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div className="font-mono" style={{ fontSize: 11, color: "#5863EA", fontWeight: 700 }}>LOADING PROFILE...</div>
      </div>
    );
  }

  // ── Not logged in ──
  if (!isSignedIn) {
    return (
      <div style={{ padding: "100px 24px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div className="glass-panel" style={{ padding: "54px 40px", borderRadius: 24, maxWidth: 440, width: "100%", textAlign: "center", border: "1px solid rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 className="font-serif" style={{ fontSize: 24, fontWeight: 700, color: "#000000", marginBottom: 12 }}>Sign in to view your profile</h2>
          <p style={{ fontSize: 14.5, color: "rgba(0,0,0,0.6)", marginBottom: 28 }}>Your saves and submissions live here.</p>
          <Link href="/" className="glass-button-primary" style={{ borderRadius: 12, padding: "14px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px 120px", position: "relative", zIndex: 1 }}>
      {/* Profile Header */}
      <div className="glass-panel" style={{ borderRadius: 24, padding: "36px", marginBottom: 40, border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        {user.imageUrl && (
          <img src={user.imageUrl} alt={user.fullName ?? "Avatar"} style={{ width: 72, height: 72, borderRadius: "50%", border: "3px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
        )}
        <div style={{ flex: 1 }}>
          <h1 className="font-serif" style={{ fontSize: 26, fontWeight: 700, color: "#000000", margin: "0 0 6px" }}>{user.fullName ?? "FlowBase Member"}</h1>
          <div className="font-mono" style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", fontWeight: 700 }}>
            {user.primaryEmailAddress?.emailAddress ?? ""}
          </div>
        </div>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {[
            [(savedWorkflows?.length ?? 0).toString(), "Saves"],
            [(mySubmissions?.filter(w => w?.status === "published").length ?? 0).toString(), "Published"],
            [(mySubmissions?.length ?? 0).toString(), "Submissions"],
          ].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div className="font-serif" style={{ fontSize: 24, fontWeight: 700, color: "#000000" }}>{n}</div>
              <div className="font-mono" style={{ fontSize: 9.5, color: "rgba(0,0,0,0.5)", fontWeight: 700, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="glass-panel" style={{ display: "inline-flex", gap: 4, padding: "6px", borderRadius: 999, marginBottom: 40, border: "1px solid rgba(0,0,0,0.06)" }}>
        {(["saves", "submissions"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="glass-button font-mono" style={{
            borderRadius: 999, padding: "8px 22px", fontSize: 10, fontWeight: 700, cursor: "pointer",
            background: tab === t ? "#000000" : "transparent",
            color: tab === t ? "#ffffff" : "rgba(0,0,0,0.6)",
            borderColor: "transparent", boxShadow: "none"
          }}>{t === "saves" ? "MY SAVES" : "MY SUBMISSIONS"}</button>
        ))}
      </div>

      {/* Saves Tab */}
      {tab === "saves" && (
        savedWorkflows?.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: "center", padding: "80px 0", borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 44, marginBottom: 16, opacity: 0.4 }}>♡</div>
            <div className="font-serif" style={{ fontSize: 20, fontWeight: 700, color: "#000000", marginBottom: 8 }}>No saves yet</div>
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", marginBottom: 24 }}>Browse workflows and hit the ♡ button to save them here.</div>
            <Link href="/workflows" className="glass-button-primary" style={{ borderRadius: 12, padding: "12px 24px", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>Browse Workflows</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {savedWorkflows?.filter(Boolean).map((w: any) => <WorkflowCard key={w._id} workflow={w} />)}
          </div>
        )
      )}

      {/* Submissions Tab */}
      {tab === "submissions" && (
        mySubmissions?.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: "center", padding: "80px 0", borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 44, marginBottom: 16, opacity: 0.4 }}>📋</div>
            <div className="font-serif" style={{ fontSize: 20, fontWeight: 700, color: "#000000", marginBottom: 8 }}>No submissions yet</div>
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", marginBottom: 24 }}>Share your AI workflow with the community.</div>
            <Link href="/submit" className="glass-button-primary" style={{ borderRadius: 12, padding: "12px 24px", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>Submit a Workflow</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mySubmissions?.filter(Boolean).map((w: any) => (
              <div key={w._id} className="glass-panel" style={{ padding: "24px 28px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <StatusBadge status={w.status} />
                    <span className="font-mono" style={{ fontSize: 9.5, color: "rgba(0,0,0,0.4)", fontWeight: 700 }}>{w.category.toUpperCase()}</span>
                  </div>
                  <h3 className="font-serif" style={{ fontSize: 18, fontWeight: 700, color: "#000000", margin: 0 }}>{w.title}</h3>
                  <p style={{ fontSize: 13.5, color: "rgba(0,0,0,0.6)", margin: "6px 0 0", lineHeight: 1.5 }}>{w.summary}</p>
                </div>
                {w.status === "published" && (
                  <Link href={`/workflows/${w.slug}`} className="glass-button font-mono" style={{ borderRadius: 12, padding: "10px 18px", fontSize: 10, fontWeight: 700, textDecoration: "none", flexShrink: 0 }}>VIEW ↗</Link>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
