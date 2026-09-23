import React from "react";
import Link from "next/link";
import { Bus, Shield, Heart, Radio, MapPin, Route, AlertCircle } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-sm">
          {/* Column 1: Brand & Disclaimer */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold">
                <Bus className="w-5 h-5 text-teal-200" />
              </div>
              <span className="font-extrabold text-white text-base">
                Transit<span className="text-teal-400">Sense</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              RTC Bus Tracker built by KLHH Students — real-time occupancy, ETA, and live route tracking for Hyderabad &amp; Secunderabad commuters.
            </p>

            <div className="inline-block bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-[11px] text-amber-300">
              <span className="font-bold">Prototype Notice:</span> Academic & engineering prototype for research. Not affiliated with TSRTC.
            </div>
          </div>

          {/* Column 2: Passenger Services */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Passenger Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/track" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-teal-500" />
                  <span>Live Bus Tracking</span>
                </Link>
              </li>
              <li>
                <Link href="/routes" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5 text-teal-500" />
                  <span>Corridor Routes & Timings</span>
                </Link>
              </li>
              <li>
                <Link href="/stops" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-500" />
                  <span>Nearby Bus Stops</span>
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-teal-500" />
                  <span>Report Delay or Overcrowding</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Hyderabad Routes */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Key Hyderabad Corridors
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/routes/route-218" className="hover:text-white transition-colors">
                  <span className="font-bold text-teal-400">218:</span> Koti ⇄ Patancheru (via Ameerpet)
                </Link>
              </li>
              <li>
                <Link href="/routes/route-25a" className="hover:text-white transition-colors">
                  <span className="font-bold text-teal-400">25A:</span> Secunderabad ⇄ Charminar
                </Link>
              </li>
              <li>
                <Link href="/routes/route-10h" className="hover:text-white transition-colors">
                  <span className="font-bold text-teal-400">10H:</span> Secunderabad ⇄ Hitec City / Kondapur
                </Link>
              </li>
              <li>
                <Link href="/routes/route-221" className="hover:text-white transition-colors">
                  <span className="font-bold text-teal-400">221:</span> Dilsukhnagar ⇄ Lingampally
                </Link>
              </li>
              <li>
                <Link href="/routes/route-290" className="hover:text-white transition-colors">
                  <span className="font-bold text-teal-400">290:</span> Secunderabad ⇄ ECIL &apos;X&apos; Roads
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Architecture */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              System Architecture
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by Next.js App Router, Leaflet telemetry, PostgreSQL & Prisma ORM. Engineered for AIS-140 GPS sensor integration and Vercel serverless scalability.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>Admin Fleet Management Console</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; 2026 Transit Sense · Built by KLHH Students. Open Engineering Project.
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>API Docs</span>
            <span>Simulation Specs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
