"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bus,
  Route,
  MapPin,
  AlertTriangle,
  Users,
  Settings,
  Shield,
  Radio,
} from "lucide-react";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { label: "Fleet Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Buses Management", href: "/admin/buses", icon: Bus },
    { label: "Routes & Corridors", href: "/admin/routes", icon: Route },
    { label: "Bus Stops Directory", href: "/admin/stops", icon: MapPin },
    { label: "Passenger Grievances", href: "/admin/reports", icon: AlertTriangle },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4 shrink-0">
      <div className="flex items-center gap-2.5 px-3 py-2 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold">
          <Shield className="w-4 h-4 text-amber-700" />
        </div>
        <div>
          <div className="text-xs font-black text-slate-900 leading-none">RTC Control Center</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Admin Dispatcher Console</div>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                isActive
                  ? "bg-teal-800 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-teal-200" : "text-slate-400"}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-3 border-t border-slate-100">
        <Link
          href="/track"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-teal-800 hover:bg-teal-50 transition-colors"
        >
          <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          <span>Open Passenger View</span>
        </Link>
      </div>
    </aside>
  );
};
