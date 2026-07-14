import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("timesheet-session")?.value;
  if (session === "authorized") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col overflow-hidden rounded-[32px] bg-white shadow-lg shadow-slate-200/50 md:flex-row">
        <section className="flex flex-1 flex-col justify-center p-8 sm:p-12 md:p-16 lg:px-20 lg:py-24">
          <LoginForm />
        </section>

        <aside className="hidden flex-1 flex-col justify-center bg-blue-600 p-10 text-white md:flex">
          <div className="max-w-xl">
            <p className="text-sm lowercase tracking-[0.35em] text-blue-200">ticktock</p>
            <p className="mt-6 max-w-lg text-base leading-7 text-blue-100">
              Introducing ticktock, our cutting-edge timesheet web application designed to revolutionize how you manage employee work hours. With ticktock, you can effortlessly track and monitor employee attendance and productivity from anywhere, anytime, using any internet connected device.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
