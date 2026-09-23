"use client";

import React, { useState, useEffect } from "react";
import { BusDTO, RouteDTO, BusStatus } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Bus,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  RefreshCw,
} from "lucide-react";

export default function AdminBusesPage() {
  const [buses, setBuses] = useState<BusDTO[]>([]);
  const [routes, setRoutes] = useState<RouteDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Bus form state
  const [newBusNumber, setNewBusNumber] = useState("");
  const [newRegNumber, setNewRegNumber] = useState("");
  const [newRouteId, setNewRouteId] = useState("");
  const [newCapacity, setNewCapacity] = useState(60);
  const [newStatus, setNewStatus] = useState<BusStatus>("ACTIVE");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [busesRes, routesRes] = await Promise.all([
        fetch("/api/buses"),
        fetch("/api/routes"),
      ]);
      const busesJson = await busesRes.json();
      const routesJson = await routesRes.json();

      if (busesJson.success) setBuses(busesJson.data);
      if (routesJson.success) setRoutes(routesJson.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (busId: string, status: BusStatus) => {
    try {
      const res = await fetch(`/api/admin/buses/${busId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setToastMessage(`Bus ${busId} status updated to ${status}`);
        fetchData();
      } else {
        alert(json.error?.message || "Failed to update status. Please make sure you are logged in as Admin.");
      }
    } catch (e) {
      alert("Error updating bus status");
    }
  };

  const handleDeactivate = async (busId: string) => {
    if (!confirm(`Are you sure you want to deactivate bus ${busId}?`)) return;

    try {
      const res = await fetch(`/api/admin/buses/${busId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setToastMessage(`Bus ${busId} deactivated`);
        fetchData();
      }
    } catch (e) {
      alert("Error deactivating bus");
    }
  };

  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/buses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          busNumber: newBusNumber.trim(),
          registrationNumber: newRegNumber.trim(),
          routeId: newRouteId || undefined,
          capacity: Number(newCapacity),
          status: newStatus,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setToastMessage(`Bus ${newBusNumber} successfully added to fleet`);
        setIsModalOpen(false);
        setNewBusNumber("");
        setNewRegNumber("");
        fetchData();
      } else {
        alert(json.error?.message || "Failed to create bus");
      }
    } catch (e) {
      alert("Error creating bus");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Bus Fleet Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Register new public buses, update route assignments, or toggle operational status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh fleet"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Bus</span>
          </button>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
            <span className="text-xs">Loading fleet inventory...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Bus / Reg No.</th>
                  <th className="py-3 px-4">Route Assigned</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Change Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {buses.map((bus) => (
                  <tr key={bus.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-800 text-white font-extrabold flex items-center justify-center text-xs">
                          {bus.busNumber}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Bus {bus.busNumber}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{bus.registrationNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {bus.route ? bus.route.routeName : "Unassigned Depot Bus"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {bus.route ? `Line #${bus.route.routeNumber}` : "In Reserve"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {bus.capacity} seats
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={bus.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={bus.status}
                        onChange={(e) => handleStatusChange(bus.id, e.target.value as BusStatus)}
                        className="h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:outline-none focus:border-teal-600"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DELAYED">DELAYED</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeactivate(bus.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Deactivate bus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Bus Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-official w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Bus className="w-5 h-5 text-teal-800" />
                <span>Register New Public Bus</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBus} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Bus Number *</label>
                  <input
                    type="text"
                    required
                    value={newBusNumber}
                    onChange={(e) => setNewBusNumber(e.target.value)}
                    placeholder="e.g. 218-C"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Registration *</label>
                  <input
                    type="text"
                    required
                    value={newRegNumber}
                    onChange={(e) => setNewRegNumber(e.target.value)}
                    placeholder="e.g. TS 09 Z 4899"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Assign Corridor Route</label>
                <select
                  value={newRouteId}
                  onChange={(e) => setNewRouteId(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
                >
                  <option value="">-- Select Transit Route --</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      Route {r.routeNumber} ({r.routeName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Seat Capacity</label>
                  <input
                    type="number"
                    min={15}
                    max={120}
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as BusStatus)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-600"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DELAYED">DELAYED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold shadow-sm flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Bus</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
