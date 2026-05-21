"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { WorkflowCard } from "@/components/WorkflowCard";

export default function PublicProfilePage({ params }: { params: Promise<{ clerkId: string }> }) {
  const { clerkId } = use(params);

  const profileUser = useQuery(api.users.getByClerkId, { clerkId });
  const workflows = useQuery(api.workflows.getBySubmitterClerkId, { clerkId });

  if (profileUser === undefined || workflows === undefined) {
    return (
      <div style={{ padding: "100px 24px", display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div className="font-mono" style={{ fontSize: 11, color: "#5863EA", fontWeight: 700 }}>LOADING PROFILE...</div>
      </div>
    );
  }

  if (profileUser === null) {
    return (
      <div style={{ padding: "100px 24px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div className="glass-panel" style={{ padding: 60, borderRadius: 24, textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤷‍♂️</div>
          <h1 className="font-serif" style={{ fontSize: 22, fontWeight: 700, color: "#000000" }}>User Not Found</h1>
          <p style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", marginTop: 12 }}>This user doesn't exist or hasn't created a profile yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px 120px", position: "relative", zIndex: 1 }}>
      {/* Profile Header */}
      <div className="glass-panel" style={{ borderRadius: 24, padding: "36px", marginBottom: 40, border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        {profileUser.avatarUrl && (
          <img src={profileUser.avatarUrl} alt={profileUser.name ?? "Avatar"} style={{ width: 72, height: 72, borderRadius: "50%", border: "3px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
        )}
        <div style={{ flex: 1 }}>
          <h1 className="font-serif" style={{ fontSize: 26, fontWeight: 700, color: "#000000", margin: "0 0 6px" }}>{profileUser.name ?? "FlowBase Contributor"}</h1>
          <div className="font-mono" style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", fontWeight: 700 }}>
            COMMUNITY CONTRIBUTOR
          </div>
        </div>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div className="font-serif" style={{ fontSize: 24, fontWeight: 700, color: "#000000" }}>{workflows.length}</div>
            <div className="font-mono" style={{ fontSize: 9.5, color: "rgba(0,0,0,0.5)", fontWeight: 700, marginTop: 4 }}>PUBLISHED</div>
          </div>
        </div>
      </div>

      <div className="font-mono" style={{ fontSize: 11, color: "#5863EA", fontWeight: 700, marginBottom: 24 }}>
        PUBLIC PLAYBOOKS
      </div>

      <div className="card-grid">
        {workflows.map(w => <WorkflowCard key={w._id} workflow={w} />)}
        {workflows.length === 0 && (
          <div className="glass-panel" style={{ gridColumn: "1/-1", textAlign: "center", padding: "100px 0", borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>📝</div>
            <div className="font-serif" style={{ fontSize: 20, fontWeight: 700, color: "#000000", marginBottom: 8 }}>No public playbooks yet</div>
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.5)" }}>This user hasn't published any workflows.</div>
          </div>
        )}
      </div>
    </div>
  );
}
