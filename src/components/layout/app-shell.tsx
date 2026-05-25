import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

type AppShellProps = {
  children: ReactNode;
};

export async function AppShell({ children }: AppShellProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const activeProfile = session.user.perfis.find(
    (perfil) => perfil.id === session.user.activeProfileId,
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <Sidebar activeProfileType={activeProfile?.tipo ?? null} />

        <div className="min-h-screen flex-1">
          <Header
            userName={session.user.name}
            activeProfileId={session.user.activeProfileId}
            activeProfileName={activeProfile?.nome ?? null}
            perfis={session.user.perfis}
          />

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
