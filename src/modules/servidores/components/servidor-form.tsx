import { createServidor } from "../actions/create-servidor";

type ServidorFormProps = {
  unidades: Array<{
    id: string;
    sigla: string;
    nome: string;
  }>;
  jornadas: Array<{
    id: string;
    nome: string;
    cargaMinutosDia: number;
  }>;
};

export function ServidorForm({ unidades, jornadas }: ServidorFormProps) {
  return (
    <form
      action={createServidor}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Novo servidor</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Nome funcional
          </label>
          <input
            name="nome"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Nome do servidor"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Login AD</label>
          <input
            name="login"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="ex: juarezvs"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            E-mail funcional
          </label>
          <input
            name="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="usuario@jfam.jus.br"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Matrícula
          </label>
          <input
            name="matricula"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Matrícula funcional"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Cargo</label>
          <input
            name="cargo"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Ex: Técnico Judiciário"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Função</label>
          <input
            name="funcao"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Ex: Diretor de Núcleo"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Unidade de lotação
          </label>
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
          <label className="text-sm font-medium text-slate-700">Jornada</label>
          <select
            name="jornadaId"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Selecione</option>
            {jornadas.map((jornada) => (
              <option key={jornada.id} value={jornada.id}>
                {jornada.nome} — {jornada.cargaMinutosDia / 60}h
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Salvar servidor
        </button>
      </div>
    </form>
  );
}
