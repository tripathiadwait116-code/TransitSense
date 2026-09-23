import React from "react";
import { BusStatus } from "@/types";
import { getStatusBadgeInfo } from "@/lib/utils";

interface StatusBadgeProps {
  status: BusStatus;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const info = getStatusBadgeInfo(status);
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${info.bg} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${info.dot}`} />
      <span>{info.label}</span>
    </span>
  );
};
