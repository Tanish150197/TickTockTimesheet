import { NextResponse } from "next/server";
import { users } from "@/lib/mock-data";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, remember } = body as {
    email: string;
    password: string;
    remember?: boolean;
  };

  const user = users.find((account) => account.email === email && account.password === password);
  if (!user) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  const response = NextResponse.json({ user: { name: user.name, email: user.email } });
  response.cookies.set("timesheet-session", "authorized", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
  });

  return response;
}
