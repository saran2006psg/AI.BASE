"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

export function CommentsSection({ workflowId }: { workflowId: Id<"workflows"> }) {
  const { isSignedIn, user } = useUser();
  const comments = useQuery(api.comments.getByWorkflow, { workflowId });
  const addComment = useMutation(api.comments.add);

  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !isSignedIn) return;

    setSubmitting(true);
    try {
      await addComment({ workflowId, text });
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "32px", borderRadius: 24, border: "1px solid rgba(0,0,0,0.08)" }}>
      <h3 className="font-serif" style={{ fontSize: 20, fontWeight: 700, color: "#000", marginBottom: 24 }}>
        Community Discussion
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
        {comments === undefined ? (
          <div className="font-mono" style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="font-mono" style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>No comments yet. Start the discussion!</div>
        ) : (
          comments.map((c) => (
            <div key={c._id} style={{ display: "flex", gap: 12 }}>
              {c.user.avatarUrl ? (
                <img src={c.user.avatarUrl} alt={c.user.name} style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {c.user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span className="font-sans" style={{ fontWeight: 700, fontSize: 14, color: "#000" }}>{c.user.name}</span>
                  <span className="font-mono" style={{ fontSize: 9, color: "rgba(0,0,0,0.4)" }}>{new Date(c._creationTime).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: 14, color: "rgba(0,0,0,0.7)", margin: "4px 0 0", lineHeight: 1.5 }}>
                  {c.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {isSignedIn ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="glass-input"
            style={{ flex: 1, padding: "12px 16px", borderRadius: 12, fontSize: 14, border: "1px solid rgba(0,0,0,0.08)" }}
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="glass-button-primary font-mono"
            style={{ borderRadius: 12, padding: "0 24px", fontSize: 11, fontWeight: 700, cursor: submitting || !text.trim() ? "not-allowed" : "pointer", opacity: submitting || !text.trim() ? 0.5 : 1 }}
          >
            POST
          </button>
        </form>
      ) : (
        <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 12, padding: "16px", textAlign: "center" }}>
          <span className="font-sans" style={{ fontSize: 13, color: "rgba(0,0,0,0.6)" }}>Sign in to join the discussion.</span>
        </div>
      )}
    </div>
  );
}
