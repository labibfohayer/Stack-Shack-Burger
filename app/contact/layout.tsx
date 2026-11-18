import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CONTACT US — STACK SHACK",
  description:
    "Got a question, feedback, or craving a smashed burger? Drop us an email anytime.",
  openGraph: {
    title: "CONTACT US — STACK SHACK",
    description:
      "Got a question, feedback, or craving a smashed burger? Drop us an email anytime.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
