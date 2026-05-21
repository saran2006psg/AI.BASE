import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// Saves — anonymous session-based save tracking
// ---------------------------------------------------------------------------
// Uses a client-generated UUID stored in localStorage as the session ID.
// This lets users save workflows without creating an account.
// When auth is added, replace sessionId with a real userId.
// ---------------------------------------------------------------------------

/** Check if a session has saved a specific workflow. */
export const isSaved = query({
  args: {
    sessionId: v.string(),
    workflowId: v.id("workflows"),
  },
  handler: async (ctx, { sessionId, workflowId }) => {
    const existing = await ctx.db
      .query("saves")
      .withIndex("by_session_and_workflow", (q) =>
        q.eq("sessionId", sessionId).eq("workflowId", workflowId)
      )
      .first();
    return !!existing;
  },
});

/** Return all workflow IDs saved by a session. */
export const getSavedIds = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const rows = await ctx.db
      .query("saves")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .collect();
    return rows.map((r) => r.workflowId);
  },
});

/** Toggle save — if already saved, unsave (and decrement count). Otherwise save (and increment count). */
export const toggle = mutation({
  args: {
    sessionId: v.string(),
    workflowId: v.id("workflows"),
  },
  handler: async (ctx, { sessionId, workflowId }) => {
    const existing = await ctx.db
      .query("saves")
      .withIndex("by_session_and_workflow", (q) =>
        q.eq("sessionId", sessionId).eq("workflowId", workflowId)
      )
      .first();

    const workflow = await ctx.db.get(workflowId);
    if (!workflow) throw new Error("Workflow not found");

    if (existing) {
      // Already saved — unsave
      await ctx.db.delete(existing._id);
      await ctx.db.patch(workflowId, {
        saveCount: Math.max(0, workflow.saveCount - 1),
      });
      return { saved: false };
    } else {
      // Not saved yet — save
      await ctx.db.insert("saves", { sessionId, workflowId });
      await ctx.db.patch(workflowId, { saveCount: workflow.saveCount + 1 });
      return { saved: true };
    }
  },
});
