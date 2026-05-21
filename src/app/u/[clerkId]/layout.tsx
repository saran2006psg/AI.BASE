import { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export async function generateMetadata({ params }: { params: Promise<{ clerkId: string }> }): Promise<Metadata> {
  const { clerkId } = await params;
  
  try {
    const user = await fetchQuery(api.users.getByClerkId, { clerkId });
    
    if (!user) {
      return {
        title: "User Not Found",
      };
    }

    const name = user.name || "FlowBase Contributor";

    return {
      title: `${name} — FlowBase`,
      description: `Check out AI playbooks and workflows published by ${name}.`,
      openGraph: {
        title: `${name} — FlowBase`,
        description: `Check out AI playbooks and workflows published by ${name}.`,
      },
    };
  } catch (error) {
    return {
      title: "FlowBase Profile",
    };
  }
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
