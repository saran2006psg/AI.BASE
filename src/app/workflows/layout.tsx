import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflow Library",
  description: "Browse curated AI workflows, step-by-step guides, and copy-paste prompts.",
};

export default function WorkflowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
