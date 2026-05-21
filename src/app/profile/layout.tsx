import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View your saved and submitted workflows.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
