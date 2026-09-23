import React from "react";
import { dataService } from "@/lib/dataService";
import { RouteCard } from "@/components/RouteCard";
import { SearchBar } from "@/components/SearchBar";
import { Route, MapPin, Milestone, Layers } from "lucide-react";

export const revalidate = 0;

export default async function RoutesPage() {
  const routes = await dataService.getRoutes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider">
          <Milestone className="w-4 h-4" />
          <span>Transit Corridors Directory</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Telangana RTC Bus Routes
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Explore major metropolitan corridors across Hyderabad, Secunderabad, and outer suburban links with stop sequences and live traffic status.
            </p>
          </div>

          <div className="w-full md:w-80">
            <SearchBar placeholder="Filter routes..." />
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
    </div>
  );
}
