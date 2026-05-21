import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tool Directory",
  description: "The best AI tools, structured by where they belong in production pipelines.",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
