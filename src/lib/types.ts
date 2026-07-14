export type TimesheetStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

export interface TimesheetSummary {
  id: string;
  weekNumber: number;
  dateRange: string;
  status: TimesheetStatus;
  totalHours: number;
}

export interface TimesheetEntry {
  id: string;
  date: string;
  task: string;
  project: string;
  type: string;
  hours: number;
  notes?: string;
}

export interface TimesheetWeekDetails extends TimesheetSummary {
  entries: TimesheetEntry[];
}
