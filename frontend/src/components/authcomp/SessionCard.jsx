import { motion } from "framer-motion";
import {
  Monitor,
  Smartphone,
  Globe,
  Clock,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { formatDate } from "../../utils/formatters";

const SessionCard = ({ session, onTerminate }) => {
  const isCurrent = session.isCurrent || false;

  const DeviceIcon =
    session.device?.toLowerCase().includes("mobile") ||
    session.os?.toLowerCase().includes("android") ||
    session.os?.toLowerCase().includes("ios")
      ? Smartphone
      : Monitor;

  return (
    <motion.div
      className={`relative bg-gray-900 border ${
        isCurrent ? "border-emerald-500" : "border-gray-800"
      } rounded-2xl shadow-md p-5 flex flex-col gap-4 transition-all`}
    >
      {/* Header section (icon + device info) */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="bg-emerald-500/10 p-3 rounded-xl flex-shrink-0">
          <DeviceIcon className="w-7 h-7 text-emerald-400" />
        </div>

        <div className="flex-1">
          <h3 className="text-white font-semibold text-base sm:text-lg capitalize break-words">
            {session.device || "Unknown Device"}
          </h3>
          <p className="text-gray-400 text-sm flex flex-wrap items-center gap-1">
            <Cpu size={14} />
            {session.os || "Unknown OS"} •{" "}
            {session.browser || "Unknown Browser"}
          </p>
          <p className="text-gray-500 text-sm flex flex-wrap items-center gap-1">
            <Globe size={14} /> {session.ipAddress || "N/A"}
          </p>
        </div>
      </div>

      {/* Divider (only on mobile for clarity) */}
      <div className="block sm:hidden border-t border-gray-800" />

      {/* Footer (time + action) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-gray-400 text-sm flex items-center gap-1">
          <Clock size={14} />
          {session.createdAt ? formatDate(session.createdAt) : "Unknown Time"}
        </div>

        {isCurrent ? (
          <div className="flex items-center justify-center sm:justify-start gap-1 text-emerald-400 font-medium text-sm px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck size={14} />
            Current
          </div>
        ) : (
          <button
            onClick={() => onTerminate(session.sessionId)}
            className="text-red-400 hover:text-red-300 text-sm font-medium px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 transition-colors w-full sm:w-auto text-center"
          >
            Terminate
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SessionCard;

