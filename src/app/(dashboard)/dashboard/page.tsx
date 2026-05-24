import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProfileSwitcher } from "@/components/layout/profile-switcher";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const activeProfile = session.user.perfis.find(
    (perfil) => perfil.id === session.user.activeProfileId,
  );

  return (
    <main className="p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard SECP</h1>
          <p className="mt-2 text-slate-600">Bem-vindo, {session.user.name}.</p>
        </div>

        <ProfileSwitcher
          activeProfileId={session.user.activeProfileId}
          perfis={session.user.perfis}
        />
      </div>

      <div className="mt-6 rounded-xl border bg-white p-4">
        <h2 className="font-semibold">Perfil ativo</h2>

        <p className="mt-2 text-slate-700">
          {activeProfile
            ? `${activeProfile.nome}${
                activeProfile.unidadeSigla
                  ? ` — ${activeProfile.unidadeSigla}`
                  : ""
              }`
            : "Nenhum perfil ativo selecionado."}
        </p>
      </div>
    </main>
  );
}
