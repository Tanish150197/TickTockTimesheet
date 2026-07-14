import { NextResponse } from "next/server";
import { timesheetSummaries } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(timesheetSummaries);
}
