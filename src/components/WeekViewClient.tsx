"use client";

import { useState } from "react";
import TimesheetModal from "@/components/TimesheetModal";
import type { TimesheetWeekDetails, TimesheetEntry } from "@/lib/types";

export default function WeekViewClient({ initialDetails }: { initialDetails: TimesheetWeekDetails }) {
  const [details, setDetails] = useState<TimesheetWeekDetails>(initialDetails);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'form' | 'full'>('form');
  const [selectedEntry, setSelectedEntry] = useState<TimesheetEntry | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  function openAdd() {
    setModalMode('form');
    setSelectedEntry(null);
    setModalOpen(true);
  }

  async function onSaveEntry(entry: Omit<TimesheetEntry, "id">, editId?: string) {
    const res = await fetch(`/api/timesheets/${details.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entry, editId }),
    });
    if (!res.ok) return;
    const body = await res.json();
    const updated = body.week as TimesheetWeekDetails;
    setDetails(updated);
    setModalOpen(false);
  }

  async function handleDeleteEntry(entryId: string) {
    const res = await fetch(`/api/timesheets/${details.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deleteId: entryId }),
    });
    if (!res.ok) return;
    const body = await res.json();
    const updated = body.week as TimesheetWeekDetails;
    setDetails(updated);
    setOpenMenuId(null);
  }

  const grouped = details.entries.reduce<Record<string, typeof details.entries>>((acc, e) => {
    acc[e.date] = acc[e.date] || [];
    acc[e.date].push(e);
    return acc;
  }, {} as Record<string, typeof details.entries>);

  return (
    <>
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{"This week's timesheet"}</h2>
            <p className="mt-2 text-sm text-slate-500">{details.dateRange}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">{details.totalHours}/40 hrs</div>
            <div className="w-48">
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div style={{ width: `${Math.min(100, (details.totalHours / 40) * 100)}%` }} className="h-2 rounded-full bg-amber-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-[120px_1fr] gap-x-6">
          <div className="space-y-6">
            {Object.keys(grouped).map((date) => (
              <div key={date} className="text-sm font-semibold text-slate-700">{date}</div>
            ))}
          </div>

          <div className="space-y-6">
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date} className="space-y-3">
                <div className="text-sm text-slate-700 font-semibold">{date}</div>
                <div className="space-y-3">
                  {items.map((entry) => (
                    <div key={entry.id} className="relative flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <div className="text-sm text-slate-800">{entry.task}</div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-slate-500">{entry.hours} hrs</div>
                        <div className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs text-sky-800">{entry.project}</div>
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === entry.id ? null : entry.id)}
                            className="text-slate-500 px-2 py-1 hover:bg-slate-100 rounded"
                            aria-label="Entry actions"
                          >
                            •••
                          </button>

                          {openMenuId === entry.id ? (
                            <div className="absolute right-0 top-8 z-20 w-32 rounded-md border border-slate-200 bg-white shadow-md">
                              <button
                                onClick={() => {
                                  setSelectedEntry(entry);
                                  setModalMode('form');
                                  setModalOpen(true);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-slate-50"
                              >
                                Delete
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button onClick={openAdd} className="w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-500 bg-white/50 hover:bg-white">
                    + Add new task
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {details ? (
        <TimesheetModal mode={modalMode} open={modalOpen} initialEntry={selectedEntry} weekDetails={details} onClose={() => { setModalOpen(false); setSelectedEntry(null); }} onSaveEntry={onSaveEntry} />
      ) : null}
    </>
  );
}
