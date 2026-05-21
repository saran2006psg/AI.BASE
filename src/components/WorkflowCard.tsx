"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { CategoryBadge, DifficultyBadge, ToolBadge } from "./ui/Badges";

// ---------------------------------------------------------------------------
// Helper: get or create a stable anonymous session ID
// ---------------------------------------------------------------------------
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("flowbase_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("flowbase_session", id);
  }
  return id;
}

// ---------------------------------------------------------------------------
// WorkflowCard
// ---------------------------------------------------------------------------
export function WorkflowCard({ workflow }: { workflow: any }) {
  const router = useRouter();
  const toggleSave = useMutation(api.saves.toggle);

  // Optimistic local state — we still reflect the real saveCount from DB
  const [savedLocally, setSavedLocally] = useState(false);
  const [optimisticCount, setOptimisticCount] = useState<number>(workflow.saveCount);
  const [sessionId, setSessionId] = useState("");

  // Hydrate sessionId client-side only (avoids SSR mismatch)
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  // Sync count from DB whenever the workflow prop updates (Convex real-time)
  useEffect(() => {
    setOptimisticCount(workflow.saveCount);
  }, [workflow.saveCount]);

  async function handleSave(e: React.MouseEvent) {
    e.stopPropagation();
    if (!sessionId) return;

    // Optimistic update — feels instant
    const willBeSaved = !savedLocally;
    setSavedLocally(willBeSaved);
    setOptimisticCount((prev) => prev + (willBeSaved ? 1 : -1));

    try {
      await toggleSave({
        sessionId,
        workflowId: workflow._id as Id<"workflows">,
      });
    } catch {
      // Rollback optimistic update on error
      setSavedLocally(!willBeSaved);
      setOptimisticCount((prev) => prev + (willBeSaved ? -1 : 1));
    }
  }

  return (
    <div
      onClick={() => router.push(`/workflows/${workflow.slug}`)}
      className="glass-card"
      style={{
        padding: "28px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
        borderRadius: 24,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <CategoryBadge cat={workflow.category} />
        <DifficultyBadge level={workflow.difficulty} />
      </div>

      <div>
        <h3
          className="font-serif"
          style={{
            fontWeight: 800,
            fontSize: 20,
            color: "#000000",
            marginBottom: 10,
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
          }}
        >
          {workflow.title}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "rgba(0, 0, 0, 0.7)",
            lineHeight: 1.6,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {workflow.summary}
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "auto" }}>
        {workflow.tools.map((t: string) => (
          <ToolBadge key={t} name={t} />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
          borderTop: "1px solid rgba(0, 0, 0, 0.06)",
          paddingTop: 18,
        }}
      >
        <span
          className="font-mono"
          style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", fontWeight: 700 }}
        >
          UPDATED {workflow.lastTested.toUpperCase()}
        </span>

        <button
          onClick={handleSave}
          className="glass-button"
          style={{
            borderRadius: 999,
            padding: "6px 14px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: savedLocally ? "#5863EA" : "rgba(0,0,0,0.4)",
            fontSize: 12,
            fontWeight: 700,
            borderColor: savedLocally
              ? "rgba(88, 99, 234, 0.3)"
              : "rgba(0, 0, 0, 0.08)",
            background: savedLocally
              ? "rgba(88, 99, 234, 0.08)"
              : "rgba(255, 255, 255, 0.8)",
            boxShadow: "none",
          }}
        >
          <span style={{ fontSize: 13 }}>{savedLocally ? "♥" : "♡"}</span>
          {optimisticCount}
        </button>
      </div>
    </div>
  );
}
