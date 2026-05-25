import { TipoJornada } from "@prisma-generated/client";

import { createJornada } from "../actions/create-jornada";

export function JornadaForm() {
  return (
    <form
      action={createJornada}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Nova jornada</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Nome</label>
          <input
            name="nome"
            required
            placeholder="Ex: Jornada especial 8h"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Tipo</label>
          <select
            name="tipo"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {Object.values(TipoJornada).map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Carga diária em horas
          </label>
          <input
            name="cargaHoras"
            type="number"
            min="1"
            max="12"
            required
            placeholder="7"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="exigeIntervalo"
              className="h-4 w-4 rounded border-slate-300"
            />
            Exige intervalo
          </label>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Intervalo mínimo em minutos
          </label>
          <input
            name="intervaloMin"
            type="number"
            min="0"
            placeholder="60"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Intervalo máximo em minutos
          </label>
          <input
            name="intervaloMax"
            type="number"
            min="0"
            placeholder="180"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Horário início padrão
          </label>
          <input
            name="horarioInicioPadrao"
            type="time"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Horário fim padrão
          </label>
          <input
            name="horarioFimPadrao"
            type="time"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Salvar jornada
        </button>
      </div>
    </form>
  );
}
