import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// QUERIES
// ---------------------------------------------------------------------------

/** Return all published workflows, sorted by saveCount descending. */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("workflows")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect()
      .then((rows) => rows.sort((a, b) => b.saveCount - a.saveCount));
  },
});

/** Return a single workflow by its URL slug. */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("workflows")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

/** Return all published workflows in a specific category. */
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, { category }) => {
    if (category === "All") {
      return await ctx.db
        .query("workflows")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .collect()
        .then((rows) => rows.sort((a, b) => b.saveCount - a.saveCount));
    }
    return await ctx.db
      .query("workflows")
      .withIndex("by_category", (q) => q.eq("category", category))
      .collect()
      .then((rows) =>
        rows
          .filter((w) => w.status === "published")
          .sort((a, b) => b.saveCount - a.saveCount)
      );
  },
});

// ---------------------------------------------------------------------------
// MUTATIONS
// ---------------------------------------------------------------------------

/** Increment a workflow's saveCount by 1. */
export const incrementSave = mutation({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, { workflowId }) => {
    const workflow = await ctx.db.get(workflowId);
    if (!workflow) throw new Error("Workflow not found");
    await ctx.db.patch(workflowId, { saveCount: workflow.saveCount + 1 });
  },
});

/** Decrement a workflow's saveCount by 1 (minimum 0). */
export const decrementSave = mutation({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, { workflowId }) => {
    const workflow = await ctx.db.get(workflowId);
    if (!workflow) throw new Error("Workflow not found");
    const newCount = Math.max(0, workflow.saveCount - 1);
    await ctx.db.patch(workflowId, { saveCount: newCount });
  },
});

/**
 * Community submission — creates a new workflow in "pending" status.
 * An admin will review and publish it via the Convex dashboard.
 */
export const submit = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    category: v.string(),
    difficulty: v.union(
      v.literal("Beginner"),
      v.literal("Intermediate"),
      v.literal("Advanced")
    ),
    tools: v.array(v.string()),
    summary: v.string(),
    lastTested: v.string(),
    problem: v.string(),
    steps: v.array(v.object({ title: v.string(), content: v.string() })),
    prompts: v.array(v.object({ label: v.string(), code: v.string() })),
    mistakes: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Ensure slug is unique
    const existing = await ctx.db
      .query("workflows")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) throw new Error("A workflow with this slug already exists.");

    return await ctx.db.insert("workflows", {
      ...args,
      saveCount: 0,
      status: "pending",
    });
  },
});
