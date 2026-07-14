import Header from "@/components/Header";
import WeekViewClient from "@/components/WeekViewClient";
import { timesheetDetails } from "@/lib/mock-data";
import type { TimesheetWeekDetails } from "@/lib/types";

export default async function WeekPage({ params }: { params: { weekId?: string } | Promise<{ weekId?: string }> }) {
  // `params` may be an object or a Promise depending on Next internals;
  // await it if it's a Promise to ensure `weekId` is available.
  const resolvedParams = (await Promise.resolve(params)) as { weekId?: string };
  const weekId = resolvedParams?.weekId as string | undefined;
  if (!weekId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-rose-600">Week ID missing</p>
      </div>
    );
  }

  const weekDetails: TimesheetWeekDetails | undefined = timesheetDetails[weekId];
  if (!weekDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-rose-600">Timesheet not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Header />

        {/* Render the interactive client component and pass initial data */}
        <WeekViewClient initialDetails={weekDetails} />

        <footer className="rounded-[28px] border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          © 2024 tentwenty. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
