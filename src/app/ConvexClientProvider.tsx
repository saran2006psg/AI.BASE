"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// ---------------------------------------------------------------------------
// ConvexClientProvider
// ---------------------------------------------------------------------------
// Wraps the entire app so every Client Component can use useQuery / useMutation.
// NEXT_PUBLIC_CONVEX_URL is set by `npx convex dev` in .env.local
// ---------------------------------------------------------------------------

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
