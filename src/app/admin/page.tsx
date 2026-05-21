"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Admin Review Page — /admin
// ---------------------------------------------------------------------------
// Only users with role === "admin" in Convex can see the actual content.
// Everyone else sees a plain access denied screen.
// ---------------------------------------------------------------------------

export default function AdminPage() {
  const { isSignedIn, isLoaded } = useUser();
  const pending = useQuery(api.workflows.getPending);
  const approve = useMutation(api.workflows.approve);
  const reject = useMutation(api.workflows.reject);

  if (!isLoaded) {
    return (
      <div style={{ padding: "100px 24px", display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div className="font-mono" style={{ fontSize: 11, color: "#5863EA", fontWeight: 700 }}>LOADING...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div style={{ padding: "100px 24px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div className="glass-panel" style={{ padding: 60, borderRadius: 24, textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h1 className="font-serif" style={{ fontSize: 22, fontWeight: 700, color: "#000000" }}>Access Denied</h1>
          <p style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", marginTop: 12 }}>You must be signed in as an admin.</p>
        </div>
      </div>
    );
  }

  // pending === undefined → loading; pending === [] → no pending (or not admin)
  const isAdmin = pending !== undefined;

  if (!isAdmin || pending === null) {
    return (
      <div style={{ padding: "100px 24px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div className="glass-panel" style={{ padding: 60, borderRadius: 24, textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
          <h1 className="font-serif" style={{ fontSize: 22, fontWeight: 700, color: "#000000" }}>Admin Only</h1>
          <p style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", marginTop: 12 }}>Your account does not have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px 120px", position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div className="font-mono" style={{ fontSize: 11, color: "#5863EA", fontWeight: 700, marginBottom: 8 }}>✦ ADMIN // REVIEW QUEUE</div>
      <h1 className="font-serif" style={{ fontSize: 36, fontWeight: 700, color: "#000000", marginBottom: 8 }}>Submission Review</h1>
      <p style={{ color: "rgba(0,0,0,0.5)", marginBottom: 48, fontSize: 15 }}>
        {pending.length === 0 ? "No pending submissions. You're all caught up!" : `${pending.length} workflow${pending.length === 1 ? "" : "s"} awaiting review.`}
      </p>

      {pending.length === 0 && (
        <div className="glass-panel" style={{ textAlign: "center", padding: "80px 0", borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>✓</div>
          <div className="font-serif" style={{ fontSize: 20, fontWeight: 700, color: "#000000" }}>All clear!</div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {pending.map((w) => (
          <div key={w._id} className="glass-panel" style={{
            borderRadius: 20,
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}>
            {/* Card Header */}
            <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <div className="font-mono" style={{ fontSize: 9.5, color: "#5863EA", fontWeight: 700, marginBottom: 6 }}>
                    {w.category.toUpperCase()} · {w.difficulty.toUpperCase()}
                  </div>
                  <h2 className="font-serif" style={{ fontSize: 22, fontWeight: 700, color: "#000000", margin: "0 0 8px" }}>{w.title}</h2>
                  <p style={{ fontSize: 14, color: "rgba(0,0,0,0.65)", margin: 0, lineHeight: 1.6 }}>{w.summary}</p>
                </div>
                {/* Approve / Reject buttons */}
                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                  <button
                    onClick={() => approve({ workflowId: w._id as Id<"workflows"> })}
                    className="glass-button font-mono"
                    style={{
                      borderRadius: 10, padding: "10px 20px", fontSize: 10, fontWeight: 700,
                      cursor: "pointer", color: "#16a34a",
                      borderColor: "rgba(34,197,94,0.3)",
                      background: "rgba(34,197,94,0.06)",
                    }}
                  >✓ APPROVE</button>
                  <button
                    onClick={() => reject({ workflowId: w._id as Id<"workflows"> })}
                    className="glass-button font-mono"
                    style={{
                      borderRadius: 10, padding: "10px 20px", fontSize: 10, fontWeight: 700,
                      cursor: "pointer", color: "#dc2626",
                      borderColor: "rgba(220,38,38,0.2)",
                      background: "rgba(220,38,38,0.04)",
                    }}
                  >✗ REJECT</button>
                </div>
              </div>
            </div>

            {/* Card details */}
            <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Tools */}
              <div>
                <div className="font-mono" style={{ fontSize: 9.5, color: "rgba(0,0,0,0.4)", fontWeight: 700, marginBottom: 8 }}>TOOLS REQUIRED</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {w.tools.map((t) => (
                    <span key={t} className="glass-badge font-mono" style={{ borderRadius: 8, padding: "3px 10px", fontSize: 10, fontWeight: 700 }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Problem */}
              <div>
                <div className="font-mono" style={{ fontSize: 9.5, color: "rgba(0,0,0,0.4)", fontWeight: 700, marginBottom: 8 }}>PROBLEM STATEMENT</div>
                <p style={{ fontSize: 13.5, color: "rgba(0,0,0,0.7)", margin: 0, lineHeight: 1.6 }}>{w.problem}</p>
              </div>

              {/* Steps count */}
              <div style={{ display: "flex", gap: 24 }}>
                <div className="font-mono" style={{ fontSize: 9.5, color: "rgba(0,0,0,0.4)", fontWeight: 700 }}>
                  {w.steps.length} STEPS · {w.prompts.length} PROMPTS · {w.mistakes.length} WARNINGS
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
