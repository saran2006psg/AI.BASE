import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/** Add a new comment to a workflow. */
export const add = mutation({
  args: {
    workflowId: v.id("workflows"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Must be logged in to comment.");

    if (!args.text.trim()) {
      throw new Error("Comment cannot be empty");
    }

    return await ctx.db.insert("comments", {
      workflowId: args.workflowId,
      tokenIdentifier: identity.tokenIdentifier,
      text: args.text.trim(),
    });
  },
});

/** Get all comments for a specific workflow, joining with the users table to get name/avatar. */
export const getByWorkflow = query({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, { workflowId }) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_workflow", (q) => q.eq("workflowId", workflowId))
      .order("asc")
      .collect();

    // Join with users table
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_token", (q) => q.eq("tokenIdentifier", comment.tokenIdentifier))
          .unique();

        return {
          ...comment,
          user: user
            ? { name: user.name, avatarUrl: user.avatarUrl, clerkId: user.clerkId }
            : { name: "Anonymous", avatarUrl: undefined, clerkId: undefined },
        };
      })
    );

    return commentsWithUsers;
  },
});
