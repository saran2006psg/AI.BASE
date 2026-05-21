// convex/auth.config.ts
// ---------------------------------------------------------------------------
// Tells Convex which JWT provider to trust.
// The domain must be your Clerk Frontend API URL.
// ---------------------------------------------------------------------------
// HOW TO GET YOUR URL:
//   1. Go to https://dashboard.clerk.com/last-active?path=api-keys
//   2. Copy your "Publishable Key" — it starts with pk_test_ or pk_live_
//   3. Go to https://dashboard.clerk.com/apps/setup/convex
//   4. Activate the Convex integration and copy the "Frontend API URL"
//      It looks like: https://your-app-name.clerk.accounts.dev
//
// Then set CLERK_JWT_ISSUER_DOMAIN in your .env.local to that URL,
// and replace the placeholder below.
// ---------------------------------------------------------------------------

export default {
  providers: [
    {
      // Replace with your Clerk Frontend API URL from the Convex setup page
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
};
