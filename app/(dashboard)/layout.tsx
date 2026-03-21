import { PropsWithChildren } from "react";
import AuthGate from "@/components/auth/AuthGate";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <AuthGate>{children}</AuthGate>;
}
