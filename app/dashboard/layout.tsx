"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const selectedBranch = localStorage.getItem("selectedBranch");

    console.log("Dashboard Layout - Checking auth...");
    console.log("isLoggedIn:", isLoggedIn);
    console.log("selectedBranch:", selectedBranch);

    if (!isLoggedIn) {
      console.log("No login found, redirecting to /login");
      router.replace("/auth/login");
      return;
    }

    if (!selectedBranch) {
      console.log("No branch selected, redirecting to /select-branch");
      router.replace("/auth/select-branch");
      return;
    }
  }, [router]);

  return <DashboardShell>{children}</DashboardShell>;
}