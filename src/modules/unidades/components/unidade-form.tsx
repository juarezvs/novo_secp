import { createUnidade } from '../actions/create-unidade'

type UnidadeFormProps = {
  orgaos: Array<{
    id: string
    sigla: string
    nome: string
  }>
  unidadesPai: Array<{
    id: string
    sigla: string
    nome: string
  }>
}

export function UnidadeForm({ orgaos, unidadesPai }: UnidadeFormProps) {
  return (
    <form
      action={createUnidade}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">
        Nova unidade
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Órgão
          </label>
          <select
            name="orgaoId"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Selecione</option>
            {orgaos.map((orgao) => (
              <option key={orgao.id} value={orgao.id}>
                {orgao.sigla} — {orgao.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Unidade superior
          </label>
          <select
            name="unidadePaiId"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Sem unidade superior</option>
            {unidadesPai.map((unidade) => (
              <option key={unidade.id} value={unidade.id}>
                {unidade.sigla} — {unidade.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Sigla
          </label>
          <input
            name="sigla"
            required
            placeholder="Ex: NUTEC"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Tipo
          </label>
          <input
            name="tipo"
            required
            placeholder="Ex: NUCLEO, SECAO, SUBSECAO"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Nome
          </label>
          <input
            name="nome"
            required
            placeholder="Nome completo da unidade"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Salvar unidade
        </button>
      </div>
    </form>
  )
}