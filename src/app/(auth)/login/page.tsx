import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export default function LoginPage() {
  async function login(formData: FormData) {
    "use server";

    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    await signIn("credentials", {
      username,
      password,
      redirectTo: "/dashboard",
    });

    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">SECP</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sistema Eletrônico de Controle de Ponto
          </p>
        </div>

        <form action={login} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Usuário de rede
            </label>
            <input
              name="username"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="ex: juarezvs"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Senha</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Senha do Active Directory"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
