"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import StatusBadge from "@/components/StatusBadge";
import TimesheetModal from "@/components/TimesheetModal";
import type { TimesheetEntry, TimesheetSummary, TimesheetWeekDetails } from "@/lib/types";
import { statusOptions } from "@/lib/mock-data";

function getActionLabel(status: string) {
  if (status === "MISSING") return "Create";
  if (status === "INCOMPLETE") return "Update";
  return "View";
}

function SortIndicator({ column, sortBy, sortDirection }: { column: 'weekNumber' | 'dateRange' | 'status'; sortBy: 'weekNumber' | 'dateRange' | 'status'; sortDirection: 'asc' | 'desc' }) {
  if (sortBy !== column) return <span className="text-slate-300">↓</span>;
  return <span className="text-slate-700 font-bold">{sortDirection === "asc" ? "↑" : "↓"}</span>;
}

export default function DashboardApp() {
  const router = useRouter();
  const [summaries, setSummaries] = useState<TimesheetSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL");
  const [details, setDetails] = useState<TimesheetWeekDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState<'weekNumber' | 'dateRange' | 'status'>('weekNumber');
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummaries() {
      const response = await fetch("/api/timesheets");
      if (!response.ok) {
        setError("Unable to load timesheet summaries.");
        return;
      }
      const data = await response.json();
      setSummaries(data);
    }
    loadSummaries();
  }, []);

  const dateOptions = useMemo(() => {
    const ranges = [...new Set(summaries.map((summary) => summary.dateRange))];
    return ["ALL", ...ranges];
  }, [summaries]);

  const filteredSummaries = useMemo(() => {
    const filtered = summaries.filter((summary) => {
      if (statusFilter !== "ALL" && summary.status !== statusFilter) {
        return false;
      }
      if (dateFilter !== "ALL" && summary.dateRange !== dateFilter) {
        return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'weekNumber') {
        return sortDirection === 'asc' ? a.weekNumber - b.weekNumber : b.weekNumber - a.weekNumber;
      }

      if (sortBy === 'dateRange') {
        return sortDirection === 'asc'
          ? a.dateRange.localeCompare(b.dateRange)
          : b.dateRange.localeCompare(a.dateRange);
      }

      // status
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    });

    return filtered;
  }, [summaries, statusFilter, dateFilter, sortDirection, sortBy]);

  const visibleSummaries = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredSummaries.slice(startIndex, startIndex + pageSize);
  }, [filteredSummaries, page, pageSize]);

  function openWeek(weekId: string) {
    // Navigate to the full week view page so the UI matches the detailed timesheet design
    router.push(`/dashboard/week/${weekId}`);
  }

  async function handleSaveEntry(entry: Omit<TimesheetEntry, "id">, editId?: string) {
    if (!details) return;

    const response = await fetch(`/api/timesheets/${details.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entry, editId }),
    });

    if (!response.ok) {
      setError("Could not save entry at this time.");
      return;
    }

    const result = await response.json();
    const updatedEntries = editId
      ? details.entries.map((existing) => (existing.id === editId ? result.entry : existing))
      : [...details.entries, result.entry];

    const totalHours = updatedEntries.reduce((sum, item) => sum + item.hours, 0);
    const nextStatus = details.status === "MISSING" ? "INCOMPLETE" : details.status;

    const updatedDetails = {
      ...details,
      entries: updatedEntries,
      totalHours,
      status: nextStatus,
    };

    setDetails(updatedDetails);
    setSummaries((current) =>
      current.map((summary) =>
        summary.id === updatedDetails.id
          ? { ...summary, status: nextStatus, totalHours }
          : summary
      )
    );
  }

  const pageCount = Math.max(1, Math.ceil(filteredSummaries.length / pageSize));

  function handlePageSizeChange(newSize: number) {
    setPageSize(newSize);
    setPage(1);
  }

  function handleSort() {
    // toggle sort for currently selected column
    setSortDirection((s) => (s === "asc" ? "desc" : "asc"));
    setPage(1);
  }


  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <Header />

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Your Timesheets</p>
              {/* <h1 className="mt-3 text-3xl font-semibold text-slate-950">Weekly timesheet overview</h1> */}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                {dateOptions.map((range) => (
                  <option key={range} value={range}>{range === "ALL" ? "Date Range" : range}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option value="ALL">Status</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em]">
                    <button
                      onClick={() => {
                        if (sortBy === 'weekNumber') {
                          handleSort();
                        } else {
                          setSortBy('weekNumber');
                          setSortDirection('asc');
                          setPage(1);
                        }
                      }}
                      className="flex items-center gap-2 hover:text-slate-700 transition cursor-pointer"
                    >
                      Week # <SortIndicator column="weekNumber" sortBy={sortBy} sortDirection={sortDirection} />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em]">
                    <div className="flex items-center gap-2">
                      Date <span className="text-slate-300">↓</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em]">
                    <div className="flex items-center gap-2">
                      Status <span className="text-slate-300">↓</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {visibleSummaries.map((summary) => (
                  <tr key={summary.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{summary.weekNumber}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{summary.dateRange}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={summary.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => openWeek(summary.id)}
                        className="text-sm font-semibold text-slate-900 transition hover:text-slate-700"
                      >
                        {getActionLabel(summary.status)}
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleSummaries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                      No timesheets match the selected filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <select
                value={pageSize}
                onChange={(event) => handlePageSizeChange(Number(event.target.value))}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option value={2}>2 per page</option>
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
              </select>
              <p className="text-sm text-slate-500">Showing {visibleSummaries.length} of {filteredSummaries.length} weeks</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pageCount }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const showDots = idx > 0 && pageNum < pageCount && Math.abs(pageNum - page) > 2;
                  if (showDots && idx < pageCount - 1 && pageNum !== page - 1 && pageNum !== page && pageNum !== page + 1) {
                    return null;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`rounded-md px-3 py-2 text-sm transition ${
                        pageNum === page
                          ? "bg-slate-900 text-white font-semibold"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {pageCount > 7 && page < pageCount - 3 && (
                  <span className="px-2 text-sm text-slate-500">...</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                disabled={page === pageCount}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <footer className="rounded-[32px] border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          © 2024 tentwenty. All rights reserved.
        </footer>
      </div>

      {details ? (
        <TimesheetModal
          key={details.id}
          open={modalOpen}
          weekDetails={details}
          onClose={() => setModalOpen(false)}
          onSaveEntry={handleSaveEntry}
        />
      ) : null}

      {loadingDetails ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40">
          <div className="rounded-3xl bg-white px-6 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-slate-900/20">
            Loading week details...
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-lg shadow-rose-200/80">
          {error}
        </div>
      ) : null}
    </div>
  );
}
