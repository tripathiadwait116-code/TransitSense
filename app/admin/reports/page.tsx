"use client";

import React, { useState, useEffect } from "react";
import { ReportStatus, ReportCategory } from "@/types";
import { AlertTriangle, CheckCircle2, Clock, Filter, Loader2, RefreshCw } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reports");
      const json = await res.json();
      if (json.success && json.data) {
        setReports(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId: string, status: ReportStatus) => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        fetchReports();
      } else {
        alert(json.error?.message || "Failed to update report status");
      }
    } catch (e) {
      alert("Error updating report");
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filterStatus === "ALL") return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Passenger Grievances & Feedback
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review reported bus delays, passenger crowding complaints, and transit incidents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-teal-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <button
            onClick={fetchReports}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
            <span className="text-xs">Loading passenger reports...</span>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-10 text-center text-slate-500 space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <div className="font-bold text-slate-800 text-sm">Grievance Queue Clear</div>
            <p className="text-xs text-slate-400">No reports matching selected filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                      {report.id}
                    </span>
                    <span className="text-xs font-bold text-slate-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                      {report.category.replace(/_/g, " ")}
                    </span>
                    {report.busNumber && (
                      <span className="text-xs font-bold text-teal-900 bg-teal-100 px-2 py-0.5 rounded border border-teal-200">
                        Bus {report.busNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">
                      {formatTimestamp(report.createdAt)}
                    </span>

                    <select
                      value={report.status}
                      onChange={(e) => handleUpdateStatus(report.id, e.target.value as ReportStatus)}
                      className={`h-7 px-2 text-xs font-bold rounded-lg border focus:outline-none ${
                        report.status === "RESOLVED"
                          ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                          : report.status === "IN_REVIEW"
                          ? "bg-blue-100 border-blue-300 text-blue-800"
                          : "bg-amber-100 border-amber-300 text-amber-800"
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_REVIEW">IN_REVIEW</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal bg-white p-3 rounded-lg border border-slate-100">
                  {report.description}
                </p>

                {report.contactEmail && (
                  <div className="text-[11px] text-slate-500">
                    Reporter Contact: <span className="font-semibold text-slate-700">{report.contactEmail}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
