// app/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Move localStorage access inside useEffect
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const selectedBranch = localStorage.getItem("selectedBranch");

    if (!isLoggedIn) {
      router.replace("/auth/login");
      return;
    }

    if (!selectedBranch) {
      router.replace("/auth/select-branch");
      return;
    }

    router.replace("/dashboard/overview");
  }, [router]);

  // Return loading state while checking authentication
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}