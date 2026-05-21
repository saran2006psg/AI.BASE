import { query, mutation, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// Helper: assert that the caller is an admin
// ---------------------------------------------------------------------------
async function assertAdmin(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: admin access required");
  }
  return user;
}

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
      .take(100)
      .then((rows) => rows.sort((a, b) => b.saveCount - a.saveCount));
  },
});

/** Search workflows by term. */
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, { searchTerm }) => {
    if (!searchTerm) {
      return await ctx.db
        .query("workflows")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .take(100)
        .then((rows) => rows.sort((a, b) => b.saveCount - a.saveCount));
    }
    return await ctx.db
      .query("workflows")
      .withSearchIndex("search_all", (q) =>
        q.search("searchBody", searchTerm).eq("status", "published")
      )
      .take(100);
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
        .take(100)
        .then((rows) => rows.sort((a, b) => b.saveCount - a.saveCount));
    }
    return await ctx.db
      .query("workflows")
      .withIndex("by_category", (q) => q.eq("category", category))
      .take(100)
      .then((rows) =>
        rows
          .filter((w) => w.status === "published")
          .sort((a, b) => b.saveCount - a.saveCount)
      );
  },
});

/** Return all workflows submitted by the current logged-in user. */
export const getBySubmitter = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("workflows")
      .withIndex("by_submitted_by", (q) =>
        q.eq("submittedBy", identity.tokenIdentifier)
      )
      .take(50);
  },
});

/** Return all published workflows submitted by a specific user (public profile). */
export const getBySubmitterClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();
    if (!user) return [];

    return await ctx.db
      .query("workflows")
      .withIndex("by_submitted_by", (q) => q.eq("submittedBy", user.tokenIdentifier))
      .take(50)
      .then(rows => rows.filter(w => w.status === "published").sort((a, b) => b.saveCount - a.saveCount));
  },
});

/** Admin only: return all pending workflows awaiting review. */
export const getPending = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user || user.role !== "admin") return [];

    return await ctx.db
      .query("workflows")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .take(50);
  },
});

/** Return all published workflows that use a specific tool. */
export const getByTool = query({
  args: { toolName: v.string() },
  handler: async (ctx, { toolName }) => {
    const allPublished = await ctx.db
      .query("workflows")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
      
    return allPublished
      .filter((w) => w.tools.some(t => t.toLowerCase() === toolName.toLowerCase()))
      .sort((a, b) => b.saveCount - a.saveCount);
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
    await ctx.db.patch(workflowId, {
      saveCount: Math.max(0, workflow.saveCount - 1),
    });
  },
});

/**
 * Community submission — creates a new workflow in "pending" status.
 * Requires the user to be logged in (Clerk).
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Must be logged in to submit a workflow");

    // Ensure slug is unique
    const existing = await ctx.db
      .query("workflows")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) throw new Error("A workflow with this slug already exists.");

    return await ctx.db.insert("workflows", {
      ...args,
      searchBody: `${args.title} ${args.summary} ${args.problem}`,
      saveCount: 0,
      status: "pending",
      submittedBy: identity.tokenIdentifier,
    });
  },
});

/** Admin only: approve a pending workflow → set status to published. */
export const approve = mutation({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, { workflowId }) => {
    await assertAdmin(ctx);
    await ctx.db.patch(workflowId, {
      status: "published",
      lastTested: "just approved",
    });
  },
});

/** Admin only: reject a pending workflow → set status to rejected. */
export const reject = mutation({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, { workflowId }) => {
    await assertAdmin(ctx);
    await ctx.db.patch(workflowId, { status: "rejected" });
  },
});
