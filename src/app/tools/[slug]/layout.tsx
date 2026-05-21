import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const toolName = decodeURIComponent(slug);
  
  return {
    title: `${toolName} Workflows — FlowBase`,
    description: `Discover curated AI playbooks and workflows that use ${toolName}.`,
    openGraph: {
      title: `${toolName} Workflows — FlowBase`,
      description: `Discover curated AI playbooks and workflows that use ${toolName}.`,
    },
  };
}

export default function ToolDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
