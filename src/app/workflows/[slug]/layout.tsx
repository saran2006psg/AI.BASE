import { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const workflow = await fetchQuery(api.workflows.getBySlug, { slug });
    
    if (!workflow) {
      return {
        title: "Workflow Not Found",
      };
    }

    return {
      title: `${workflow.title} — FlowBase`,
      description: workflow.summary,
      openGraph: {
        title: `${workflow.title} — FlowBase`,
        description: workflow.summary,
      },
    };
  } catch (error) {
    return {
      title: "FlowBase Workflow",
    };
  }
}

export default function WorkflowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
