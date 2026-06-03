import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center px-20">
        <h1 className="text-6xl font-bold mb-6">
          InvestArena
        </h1>

        <p className="text-zinc-400 text-xl mb-8">
          Learn investing through simulation,
          competitions and AI insights.
        </p>

        <div className="h-80 rounded-3xl bg-zinc-900 border border-zinc-800" />
      </div>

      <div className="flex justify-center items-center p-6">
        <LoginForm />
      </div>
    </main>
  );
}