import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">SECP</h1>

          <p className="mt-2 text-sm text-slate-600">
            Sistema Eletrônico de Controle de Ponto
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
