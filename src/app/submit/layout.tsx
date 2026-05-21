import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Workflow",
  description: "Share your custom AI workflows with the FlowBase community.",
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
