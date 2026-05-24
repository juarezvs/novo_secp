"use client";

import { useTransition } from "react";
import { switchActiveProfile } from "@/modules/auth/actions/switch-active-profile";

type ProfileSwitcherProps = {
  activeProfileId: string | null;
  perfis: Array<{
    id: string;
    nome: string;
    unidadeSigla: string | null;
  }>;
};

export function ProfileSwitcher({
  activeProfileId,
  perfis,
}: ProfileSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={activeProfileId ?? ""}
      disabled={isPending}
      onChange={(event) => {
        const perfilId = event.target.value;

        if (!perfilId) return;

        startTransition(async () => {
          await switchActiveProfile(perfilId);
          window.location.reload();
        });
      }}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
    >
      <option value="">Selecione um perfil</option>

      {perfis.map((perfil) => (
        <option key={perfil.id} value={perfil.id}>
          {perfil.nome}
          {perfil.unidadeSigla ? ` — ${perfil.unidadeSigla}` : ""}
        </option>
      ))}
    </select>
  );
}
