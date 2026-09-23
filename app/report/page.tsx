"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, Send, Bus, HelpCircle, Loader2 } from "lucide-react";

export default function ReportIssuePage() {
  const [category, setCategory] = useState("BUS_DELAY");
  const [busNumber, setBusNumber] = useState("");
  const [routeId, setRouteId] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          busNumber: busNumber.trim() || undefined,
          routeId: routeId.trim() || undefined,
          description: description.trim(),
          contactEmail: contactEmail.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSubmittedReceipt(json.data.id);
      } else {
        setErrorMessage(json.error?.message || "Failed to submit grievance report");
      }
    } catch (err: any) {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Commuter Grievance & Feedback Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Report a Transit Issue
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Submit feedback regarding bus delays, severe overcrowding, missing services, or inaccurate ETAs. Reports are logged and reviewed in the administrative control dashboard.
        </p>
      </div>

      {submittedReceipt ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-emerald-950">Grievance Submitted Successfully</h2>
            <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
              Your report has been forwarded to TSRTC fleet dispatchers.
            </p>
            <div className="mt-4 inline-block bg-white border border-emerald-300 px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-800 shadow-inner">
              Tracking Reference: {submittedReceipt}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setSubmittedReceipt(null);
                setDescription("");
                setBusNumber("");
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5"
        >
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Issue Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Issue Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            >
              <option value="BUS_DELAY">Bus Delay / Not on Schedule</option>
              <option value="OVERCROWDING">Severe Passenger Overcrowding</option>
              <option value="BUS_NOT_FOUND">Scheduled Bus Not Arrived / Skipped Stop</option>
              <option value="INCORRECT_ETA">Inaccurate ETA on App</option>
              <option value="STOP_ISSUE">Bus Stop Infrastructure / Shelter Issue</option>
              <option value="OTHER">Other Transit Complaint</option>
            </select>
          </div>

          {/* Bus Number & Route */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Bus Number (Optional)
              </label>
              <input
                type="text"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                placeholder="e.g. 218 or 25A"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Route or Stop Corridor
              </label>
              <input
                type="text"
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                placeholder="e.g. Ameerpet to Koti"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Issue Description *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the incident, stop location, approximate time, and details (min 10 characters)..."
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            />
          </div>

          {/* Contact Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Your Email Address (Optional for follow-up)
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="commuter@example.com"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || description.trim().length < 10}
              className="w-full h-12 bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Submit Grievance Report</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
