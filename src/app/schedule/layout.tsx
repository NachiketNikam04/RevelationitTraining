import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Interview Scheduling Portal | Revelation IT Training",
  description:
    "Schedule and manage your mock interview sessions with industry professionals.",
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
