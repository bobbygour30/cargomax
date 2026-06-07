"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import OverviewPage from "@/components/overview/overviewPage";

export default function Overview() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const selectedBranch = localStorage.getItem("selectedBranch");

    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    if (!selectedBranch) {
      router.replace("/select-branch");
      return;
    }
  }, [router]);

  return <OverviewPage />;
}