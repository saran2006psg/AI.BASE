import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// FlowBase — Convex Database Schema
// ---------------------------------------------------------------------------
// Three tables:
//   workflows — the core playbook entries
//   tools     — the AI tool directory
//   saves     — a join between anonymous session IDs and workflow IDs
// ---------------------------------------------------------------------------

export default defineSchema({
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
    // Publication status — only "published" workflows appear in the library
    status: v.union(v.literal("published"), v.literal("draft"), v.literal("pending")),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_save_count", ["saveCount"]),

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
  // saves
  // Simple anonymous save tracking via a session ID stored in localStorage.
  // When auth is added, replace sessionId with userId.
  // -------------------------------------------------------------------------
  saves: defineTable({
    sessionId: v.string(),
    workflowId: v.id("workflows"),
  })
    .index("by_session", ["sessionId"])
    .index("by_session_and_workflow", ["sessionId", "workflowId"]),
});
