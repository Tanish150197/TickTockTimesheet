import type { TimesheetStatus } from "@/lib/types";

const statusStyles: Record<TimesheetStatus, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-800",
  INCOMPLETE: "bg-amber-100 text-amber-800",
  MISSING: "bg-rose-100 text-rose-800",
};

export default function StatusBadge({ status }: { status: TimesheetStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
