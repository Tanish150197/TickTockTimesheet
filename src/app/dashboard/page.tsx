import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardApp from "@/components/DashboardApp";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("timesheet-session")?.value;
  if (session !== "authorized") {
    redirect("/");
  }

  return <DashboardApp />;
}
