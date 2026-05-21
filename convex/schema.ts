import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// FlowBase — Convex Database Schema (v2 — with Auth)
// ---------------------------------------------------------------------------

export default defineSchema({
  // -------------------------------------------------------------------------
  // users — synced from Clerk on first login
  // -------------------------------------------------------------------------
  users: defineTable({
    // Clerk's stable token identifier — use this for all ownership checks
    tokenIdentifier: v.string(),
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    // Role-based access: "user" = normal, "admin" = can approve submissions
    role: v.union(v.literal("user"), v.literal("admin")),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_clerk_id", ["clerkId"]),

  // -------------------------------------------------------------------------
  // workflows
  // -------------------------------------------------------------------------
  workflows: defineTable({
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
    saveCount: v.number(),
    lastTested: v.string(),
    problem: v.string(),
    steps: v.array(
      v.object({
        title: v.string(),
        content: v.string(),
      })
    ),
    prompts: v.array(
      v.object({
        label: v.string(),
        code: v.string(),
      })
    ),
    mistakes: v.array(v.string()),
    // Publication status
    status: v.union(v.literal("published"), v.literal("draft"), v.literal("pending"), v.literal("rejected")),
    // Who submitted it (Clerk tokenIdentifier — optional for seeded data)
    submittedBy: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_save_count", ["saveCount"])
    .index("by_submitted_by", ["submittedBy"]),

  // -------------------------------------------------------------------------
  // tools
  // -------------------------------------------------------------------------
  tools: defineTable({
    name: v.string(),
    category: v.string(),
    description: v.string(),
    url: v.string(),
    emoji: v.string(),
  }).index("by_category", ["category"]),

  // -------------------------------------------------------------------------
  // saves — now keyed by tokenIdentifier (Clerk) instead of anonymous sessionId
  // The sessionId field is kept as optional for backwards compatibility with
  // existing anonymous saves during the transition period.
  // -------------------------------------------------------------------------
  saves: defineTable({
    // Real user token from Clerk (set when logged in)
    tokenIdentifier: v.optional(v.string()),
    // Legacy anonymous session ID (kept for backward compatibility)
    sessionId: v.optional(v.string()),
    workflowId: v.id("workflows"),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_token_and_workflow", ["tokenIdentifier", "workflowId"])
    .index("by_session", ["sessionId"])
    .index("by_session_and_workflow", ["sessionId", "workflowId"]),
});
