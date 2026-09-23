import React from "react";
import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <AdminSidebar />
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  );
}
