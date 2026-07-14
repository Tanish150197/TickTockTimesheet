import { NextResponse } from "next/server";
import { timesheetDetails, timesheetSummaries } from "@/lib/mock-data";
import type { TimesheetEntry } from "@/lib/types";

export async function GET(request: Request, context: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await context.params;
  const week = timesheetDetails[weekId];
  if (!week) {
    return NextResponse.json({ message: "Timesheet not found." }, { status: 404 });
  }
  return NextResponse.json(week);
}

export async function POST(request: Request, context: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await context.params;
  const week = timesheetDetails[weekId];
  if (!week) {
    return NextResponse.json({ message: "Timesheet not found." }, { status: 404 });
  }

  const body = await request.json();
  const { entry, editId } = body as { entry: Omit<TimesheetEntry, "id">; editId?: string };
  const newEntry: TimesheetEntry = {
    id: editId ?? `entry-${Date.now()}`,
    ...entry,
  };

  if (editId) {
    const index = week.entries.findIndex((item) => item.id === editId);
    if (index === -1) {
      return NextResponse.json({ message: "Entry not found." }, { status: 404 });
    }
    week.entries[index] = newEntry;
  } else {
    week.entries.push(newEntry);
  }

  week.totalHours = week.entries.reduce((sum, item) => sum + item.hours, 0);
  if (week.status === "MISSING") {
    week.status = "INCOMPLETE";
  }

  const summary = timesheetSummaries.find((item) => item.id === week.id);
  if (summary) {
    summary.status = week.status;
    summary.totalHours = week.totalHours;
  }

  return NextResponse.json({ entry: newEntry, week });
}

export async function DELETE(request: Request, context: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await context.params;
  const week = timesheetDetails[weekId];
  if (!week) {
    return NextResponse.json({ message: "Timesheet not found." }, { status: 404 });
  }

  const body = await request.json();
  const { deleteId } = body as { deleteId?: string };
  if (!deleteId) {
    return NextResponse.json({ message: "deleteId required." }, { status: 400 });
  }

  const index = week.entries.findIndex((e) => e.id === deleteId);
  if (index === -1) {
    return NextResponse.json({ message: "Entry not found." }, { status: 404 });
  }

  week.entries.splice(index, 1);
  week.totalHours = week.entries.reduce((sum, item) => sum + item.hours, 0);
  if (week.entries.length === 0) {
    week.status = "MISSING";
  }

  const summary = timesheetSummaries.find((item) => item.id === week.id);
  if (summary) {
    summary.status = week.status;
    summary.totalHours = week.totalHours;
  }

  return NextResponse.json({ message: "Deleted", week });
}
