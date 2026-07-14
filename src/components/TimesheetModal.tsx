"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import type { TimesheetEntry, TimesheetWeekDetails } from "@/lib/types";
import { projectOptions, workTypeOptions } from "@/lib/mock-data";

interface TimesheetModalProps {
  weekDetails: TimesheetWeekDetails;
  open: boolean;
  mode?: "form" | "full";
  initialEntry?: TimesheetEntry | null;
  onClose: () => void;
  onSaveEntry: (entry: Omit<TimesheetEntry, "id">, editId?: string) => Promise<void>;
}

const defaultFormState = {
  id: null as string | null,
  date: "",
  task: "",
  project: projectOptions[0],
  type: workTypeOptions[0],
  hours: 1,
  notes: "",
};

export default function TimesheetModal({
  weekDetails,
  open,
  mode = "full",
  initialEntry = null,
  onClose,
  onSaveEntry,
}: TimesheetModalProps) {
  const [formState, setFormState] = useState(() => defaultFormState);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const dateRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open && mode === "form") {
      dateRef.current?.focus();
    }
  }, [open, mode]);

  useEffect(() => {
    if (open && initialEntry) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormState({
        id: initialEntry.id,
        date: initialEntry.date,
        task: initialEntry.task,
        project: initialEntry.project,
        type: initialEntry.type,
        hours: initialEntry.hours,
        notes: initialEntry.notes ?? "",
      });
    }
    if (!open) {
      setFormState(defaultFormState);
    }
  }, [open, initialEntry]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!formState.task.trim() || !formState.date.trim() || !formState.hours) {
      setError("Please fill the date, task, and hours fields.");
      return;
    }

    setSaving(true);
    await onSaveEntry(
      {
        date: formState.date,
        task: formState.task,
        project: formState.project,
        type: formState.type,
        hours: formState.hours,
        notes: formState.notes || undefined,
      },
      formState.id ?? undefined
    );
    setSaving(false);
    setFormState(defaultFormState);
  }

  const formJSX = (
    <form className="space-y-5 rounded-md border border-slate-200 bg-white p-4 shadow-sm" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">Date *</label>
        <input
          type="text"
          value={formState.date}
          onChange={(event) => setFormState((prev) => ({ ...prev, date: event.target.value }))}
          placeholder="Jan 21"
          ref={dateRef}
          className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">Project *</label>
        <select
          value={formState.project}
          onChange={(event) => setFormState((prev) => ({ ...prev, project: event.target.value }))}
          className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        >
          {projectOptions.map((project) => (
            <option key={project} value={project}>{project}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">Type of Work *</label>
        <select
          value={formState.type}
          onChange={(event) => setFormState((prev) => ({ ...prev, type: event.target.value }))}
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        >
          {workTypeOptions.map((typeOption) => (
            <option key={typeOption} value={typeOption}>{typeOption}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">Task description *</label>
        <textarea
          rows={4}
          value={formState.task}
          onChange={(event) => setFormState((prev) => ({ ...prev, task: event.target.value }))}
          placeholder="Write text here ..."
          className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">Notes</label>
        <textarea
          rows={2}
          value={formState.notes}
          onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
          placeholder="A note for extra info"
          className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">Hours *</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFormState((p) => ({ ...p, hours: Math.max(0, p.hours - 1) }))}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            -
          </button>
          <div className="inline-flex min-w-[56px] items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
            {formState.hours}
          </div>
          <button
            type="button"
            onClick={() => setFormState((p) => ({ ...p, hours: Math.min(24, p.hours + 1) }))}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 rounded-md bg-[#166EFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f5fe6] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={saving}
        >
          {saving ? "Saving..." : formState.id ? "Update entry" : "Add entry"}
        </button>

        <button
          type="button"
          onClick={() => {
              setFormState(defaultFormState);
              onClose();
            }}
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </form>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-800/60 px-6 py-8">
      <div className="w-full max-w-[640px] overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add New Entry</h2>
            <p className="mt-1 text-sm text-slate-500">Week {weekDetails.weekNumber} • {weekDetails.dateRange}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        {mode === "full" ? (
          <div className="grid gap-6 px-6 py-6 sm:grid-cols-[0.7fr_1.3fr]">
            <div className="space-y-4">
              <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-sm font-semibold text-slate-700">Entries</p>
                <div className="space-y-3">
                  {weekDetails.entries.length === 0 ? (
                    <p className="text-sm text-slate-500">No entries yet for this week.</p>
                  ) : (
                    weekDetails.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{entry.task}</p>
                          <p className="text-sm text-slate-500">{entry.date} · {entry.project}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{entry.hours}h</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormState({
                                id: entry.id,
                                date: entry.date,
                                task: entry.task,
                                project: entry.project,
                                type: entry.type,
                                hours: entry.hours,
                                notes: entry.notes ?? "",
                              });
                            }}
                            className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormState(defaultFormState);
                  }}
                  className="mt-3 flex w-full items-center justify-center rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  + Add new task
                </button>
              </div>
            </div>

            <div>
              {formJSX}
            </div>
          </div>
        ) : (
          <div className="px-6 py-6">
            <div>
              {formJSX}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
