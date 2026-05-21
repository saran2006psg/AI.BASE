import { query, mutation, MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// ---------------------------------------------------------------------------
// Saves — supports both authenticated (tokenIdentifier) and anonymous (sessionId)
// ---------------------------------------------------------------------------

/** Check if the current user has saved a specific workflow. */
export const isSaved = query({
  args: {
    workflowId: v.id("workflows"),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, { workflowId, sessionId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity) {
      // Authenticated path
      const existing = await ctx.db
        .query("saves")
        .withIndex("by_token_and_workflow", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier).eq("workflowId", workflowId)
        )
        .first();
      return !!existing;
    }

    if (sessionId) {
      // Anonymous fallback
      const existing = await ctx.db
        .query("saves")
        .withIndex("by_session_and_workflow", (q) =>
          q.eq("sessionId", sessionId).eq("workflowId", workflowId)
        )
        .first();
      return !!existing;
    }

    return false;
  },
});

/** Return all workflow IDs saved by the current user (or session). */
export const getSavedIds = query({
  args: { sessionId: v.optional(v.string()) },
  handler: async (ctx, { sessionId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity) {
      const rows = await ctx.db
        .query("saves")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
        .take(200);
      return rows.map((r) => r.workflowId);
    }

    if (sessionId) {
      const rows = await ctx.db
        .query("saves")
        .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
        .take(200);
      return rows.map((r) => r.workflowId);
    }

    return [];
  },
});

/** Return full workflow documents saved by the current logged-in user. */
export const getSavedWorkflows = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const saveRows = await ctx.db
      .query("saves")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .take(100);

    const workflows = await Promise.all(
      saveRows.map((s) => ctx.db.get(s.workflowId))
    );
    return workflows.filter(Boolean);
  },
});

/**
 * Toggle save — auth-aware.
 * If user is logged in, uses their tokenIdentifier.
 * Falls back to anonymous sessionId if not logged in.
 */
export const toggle = mutation({
  args: {
    workflowId: v.id("workflows"),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, { workflowId, sessionId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const workflow = await ctx.db.get(workflowId);
    if (!workflow) throw new Error("Workflow not found");

    if (identity) {
      // Authenticated toggle
      const existing = await ctx.db
        .query("saves")
        .withIndex("by_token_and_workflow", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier).eq("workflowId", workflowId)
        )
        .first();

      if (existing) {
        await ctx.db.delete(existing._id);
        await ctx.db.patch(workflowId, {
          saveCount: Math.max(0, workflow.saveCount - 1),
        });
        return { saved: false };
      } else {
        await ctx.db.insert("saves", {
          tokenIdentifier: identity.tokenIdentifier,
          workflowId,
        });
        await ctx.db.patch(workflowId, { saveCount: workflow.saveCount + 1 });
        return { saved: true };
      }
    }

    // Anonymous toggle (sessionId fallback)
    if (!sessionId) throw new Error("sessionId required when not authenticated");

    const existing = await ctx.db
      .query("saves")
      .withIndex("by_session_and_workflow", (q) =>
        q.eq("sessionId", sessionId).eq("workflowId", workflowId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.patch(workflowId, {
        saveCount: Math.max(0, workflow.saveCount - 1),
      });
      return { saved: false };
    } else {
      await ctx.db.insert("saves", { sessionId, workflowId });
      await ctx.db.patch(workflowId, { saveCount: workflow.saveCount + 1 });
      return { saved: true };
    }
  },
});
