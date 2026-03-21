import { PropsWithChildren } from "react";
import AdminGate from "@/components/auth/AdminGate";

export default function AdminLayout({ children }: PropsWithChildren) {
  return <AdminGate>{children}</AdminGate>;
}
