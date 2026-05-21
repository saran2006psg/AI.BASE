import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// Helper: get the current user's Convex document (or null if not logged in)
// ---------------------------------------------------------------------------
async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();
}

// ---------------------------------------------------------------------------
// QUERIES
// ---------------------------------------------------------------------------

/** Returns the current logged-in user's Convex document. */
export const me = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

// ---------------------------------------------------------------------------
// MUTATIONS
// ---------------------------------------------------------------------------

/**
 * Called client-side on every login/signup via Clerk.
 * Creates a new user record if this is their first login.
 * Returns the user document.
 */
export const getOrCreate = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (existing) {
      // Patch any updated fields (name/avatar can change in Clerk)
      await ctx.db.patch(existing._id, {
        name: identity.name ?? existing.name,
        email: identity.email ?? existing.email,
        avatarUrl: (identity.pictureUrl as string | undefined) ?? existing.avatarUrl,
      });
      return existing._id;
    }

    // First login — create user record
    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      clerkId: identity.subject,
      name: identity.name ?? undefined,
      email: identity.email ?? undefined,
      avatarUrl: (identity.pictureUrl as string | undefined) ?? undefined,
      role: "user",
    });
  },
});
