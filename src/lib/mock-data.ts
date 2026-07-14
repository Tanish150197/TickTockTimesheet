import type { TimesheetSummary, TimesheetStatus, TimesheetWeekDetails } from "@/lib/types";

export interface UserAccount {
  email: string;
  password: string;
  name: string;
}

export const users: UserAccount[] = [
  {
    email: "admin@ticktock.com",
    password: "Password123!",
    name: "John Doe",
  },
];

export const projectOptions = [
  "Marketing Website",
  "Product Launch",
  "Platform Integrations",
  "Design System",
];

export const workTypeOptions = [
  "Bug fixes",
  "Feature work",
  "Design review",
  "Testing",
  "Client meeting",
];

export const timesheetSummaries: TimesheetSummary[] = [
  {
    id: "week-1",
    weekNumber: 1,
    dateRange: "1 - 5 January, 2024",
    status: "COMPLETED",
    totalHours: 40,
  },
  {
    id: "week-2",
    weekNumber: 2,
    dateRange: "8 - 12 January, 2024",
    status: "COMPLETED",
    totalHours: 40,
  },
  {
    id: "week-3",
    weekNumber: 3,
    dateRange: "15 - 19 January, 2024",
    status: "INCOMPLETE",
    totalHours: 28,
  },
  {
    id: "week-4",
    weekNumber: 4,
    dateRange: "22 - 26 January, 2024",
    status: "COMPLETED",
    totalHours: 40,
  },
  {
    id: "week-5",
    weekNumber: 5,
    dateRange: "28 January - 1 February, 2024",
    status: "MISSING",
    totalHours: 0,
  },
];

export const timesheetDetails: Record<string, TimesheetWeekDetails> = {
  "week-1": {
    id: "week-1",
    weekNumber: 1,
    dateRange: "1 - 5 January, 2024",
    status: "COMPLETED",
    totalHours: 40,
    entries: [
      {
        id: "entry-101",
        date: "Jan 1",
        task: "Homepage Development",
        project: "Marketing Website",
        type: "Feature work",
        hours: 8,
        notes: "Landing page layout and header.",
      },
      {
        id: "entry-102",
        date: "Jan 2",
        task: "Homepage Development",
        project: "Marketing Website",
        type: "Feature work",
        hours: 8,
      },
      {
        id: "entry-103",
        date: "Jan 3",
        task: "Product Launch Tasks",
        project: "Product Launch",
        type: "Bug fixes",
        hours: 8,
      },
      {
        id: "entry-104",
        date: "Jan 4",
        task: "Design review session",
        project: "Design System",
        type: "Design review",
        hours: 8,
      },
      {
        id: "entry-105",
        date: "Jan 5",
        task: "Sprint planning",
        project: "Platform Integrations",
        type: "Client meeting",
        hours: 8,
      },
    ],
  },
  "week-2": {
    id: "week-2",
    weekNumber: 2,
    dateRange: "8 - 12 January, 2024",
    status: "COMPLETED",
    totalHours: 40,
    entries: [
      {
        id: "entry-201",
        date: "Jan 8",
        task: "Platform Integrations",
        project: "Platform Integrations",
        type: "Feature work",
        hours: 8,
      },
      {
        id: "entry-202",
        date: "Jan 9",
        task: "Testing user flows",
        project: "Marketing Website",
        type: "Testing",
        hours: 8,
      },
      {
        id: "entry-203",
        date: "Jan 10",
        task: "Client review",
        project: "Product Launch",
        type: "Client meeting",
        hours: 8,
      },
      {
        id: "entry-204",
        date: "Jan 11",
        task: "Bug fixes",
        project: "Design System",
        type: "Bug fixes",
        hours: 8,
      },
      {
        id: "entry-205",
        date: "Jan 12",
        task: "Documentation updates",
        project: "Marketing Website",
        type: "Feature work",
        hours: 8,
      },
    ],
  },
  "week-3": {
    id: "week-3",
    weekNumber: 3,
    dateRange: "15 - 19 January, 2024",
    status: "INCOMPLETE",
    totalHours: 28,
    entries: [
      {
        id: "entry-301",
        date: "Jan 15",
        task: "Homepage Development",
        project: "Marketing Website",
        type: "Feature work",
        hours: 8,
      },
      {
        id: "entry-302",
        date: "Jan 16",
        task: "Testing improvements",
        project: "Design System",
        type: "Testing",
        hours: 8,
      },
      {
        id: "entry-303",
        date: "Jan 18",
        task: "Sprint review",
        project: "Product Launch",
        type: "Client meeting",
        hours: 12,
      },
    ],
  },
  "week-4": {
    id: "week-4",
    weekNumber: 4,
    dateRange: "22 - 26 January, 2024",
    status: "COMPLETED",
    totalHours: 40,
    entries: [
      {
        id: "entry-401",
        date: "Jan 22",
        task: "Project planning",
        project: "Product Launch",
        type: "Design review",
        hours: 8,
      },
      {
        id: "entry-402",
        date: "Jan 23",
        task: "Bug fixes",
        project: "Design System",
        type: "Bug fixes",
        hours: 8,
      },
      {
        id: "entry-403",
        date: "Jan 24",
        task: "Team sync",
        project: "Marketing Website",
        type: "Client meeting",
        hours: 8,
      },
      {
        id: "entry-404",
        date: "Jan 25",
        task: "Integration support",
        project: "Platform Integrations",
        type: "Feature work",
        hours: 8,
      },
      {
        id: "entry-405",
        date: "Jan 26",
        task: "Sprint close",
        project: "Product Launch",
        type: "Design review",
        hours: 8,
      },
    ],
  },
  "week-5": {
    id: "week-5",
    weekNumber: 5,
    dateRange: "28 January - 1 February, 2024",
    status: "MISSING",
    totalHours: 0,
    entries: [],
  },
};

export const statusOptions: TimesheetStatus[] = ["COMPLETED", "INCOMPLETE", "MISSING"];
