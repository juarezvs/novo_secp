"use client";
import { useActionState } from "react";
import { createEquipamento } from "../actions/create-equipamento";
import { ActionFeedback } from "@/shared/ui/action-feedback";
import { SubmitButton } from "@/shared/ui/submit-button";
import type { ActionState } from "@/shared/actions/action-state";

type Props = {
  unidades: Array<{
    id: string;
    sigla: string;
    nome: string;
  }>;
};

export function EquipamentoForm({ unidades }: Props) {
  const initialState: ActionState = {
    ok: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(
    createEquipamento,
    initialState,
  );
  return (
    <form
      action={formAction}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">
        Novo equipamento biométrico
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Unidade</label>
          <select
            name="unidadeId"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Selecione</option>
            {unidades.map((unidade) => (
              <option key={unidade.id} value={unidade.id}>
                {unidade.sigla} — {unidade.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Código</label>
          <input
            name="codigo"
            required
            placeholder="Ex: REP-SJAM-001"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Nome</label>
          <input
            name="nome"
            required
            placeholder="Relógio de ponto da recepção"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">IP</label>
          <input
            name="ip"
            placeholder="192.168.0.10"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Localização
          </label>
          <input
            name="localizacao"
            placeholder="Ex: Entrada principal da SJAM"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <ActionFeedback state={state} />
        <SubmitButton isPending={isPending} idleText="Salvar equipamento" />
      </div>
    </form>
  );
}
