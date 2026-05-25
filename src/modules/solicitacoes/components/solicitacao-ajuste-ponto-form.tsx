import { TipoMarcacao } from "@prisma-generated/client";
import { createSolicitacaoAjustePonto } from "../actions/create-solicitacao-ajuste-ponto";

export function SolicitacaoAjustePontoForm() {
  return (
    <form
      action={createSolicitacaoAjustePonto}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">
        Solicitar ajuste de ponto
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Data</label>
          <input
            name="data"
            type="date"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Hora</label>
          <input
            name="hora"
            type="time"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Tipo de marcação
          </label>
          <select
            name="tipoMarcacao"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Selecione</option>
            <option value={TipoMarcacao.ENTRADA}>Entrada</option>
            <option value={TipoMarcacao.SAIDA_INTERVALO}>
              Saída intervalo
            </option>
            <option value={TipoMarcacao.RETORNO_INTERVALO}>
              Retorno intervalo
            </option>
            <option value={TipoMarcacao.SAIDA}>Saída</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Justificativa
          </label>
          <textarea
            name="justificativa"
            required
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Explique o motivo do ajuste solicitado."
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Enviar solicitação
        </button>
      </div>
    </form>
  );
}
