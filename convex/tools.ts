import { query } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// QUERIES
// ---------------------------------------------------------------------------

/** Return all tools in the directory. */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tools").collect();
  },
});

/** Return all tools filtered by category. */
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, { category }) => {
    if (category === "All") {
      return await ctx.db.query("tools").collect();
    }
    return await ctx.db
      .query("tools")
      .withIndex("by_category", (q) => q.eq("category", category))
      .collect();
  },
});
