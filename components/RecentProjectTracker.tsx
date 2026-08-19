"use client";

import { useEffect } from "react";
import { recordRecentRoute } from "@/lib/recent";

export function RecentProjectTracker({ href }: { href: string }) {
  useEffect(() => {
    recordRecentRoute(href);
  }, [href]);

  return null;
}
