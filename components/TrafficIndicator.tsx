import React from "react";
import { TrafficCondition } from "@/types";
import { getTrafficColor } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle } from "lucide-react";

interface TrafficIndicatorProps {
  condition?: TrafficCondition | null;
  delayMinutes?: number;
  description?: string | null;
  compact?: boolean;
}

export const TrafficIndicator: React.FC<TrafficIndicatorProps> = ({
  condition = "LOW",
  delayMinutes = 0,
  description,
  compact = false,
}) => {
  const safeCondition = condition || "LOW";
  const info = getTrafficColor(safeCondition);

  const renderIcon = () => {
    switch (safeCondition) {
      case "LOW":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case "MODERATE":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case "HEAVY":
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${info.bg}`}
        title={description || info.label}
      >
        {renderIcon()}
        <span>
          {safeCondition === "LOW"
            ? "Normal"
            : `+${delayMinutes}m delay`}
        </span>
      </span>
    );
  }

  return (
    <div className={`p-2.5 rounded-lg border ${info.bg} flex items-start gap-2.5`}>
      <div className="mt-0.5">{renderIcon()}</div>
      <div className="flex-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold">{info.label}</span>
          {delayMinutes > 0 && (
            <span className="font-bold text-amber-900 bg-amber-200/60 px-1.5 py-0.5 rounded">
              +{delayMinutes} mins delay
            </span>
          )}
        </div>
        {description && <p className="mt-0.5 text-slate-600">{description}</p>}
      </div>
    </div>
  );
};
