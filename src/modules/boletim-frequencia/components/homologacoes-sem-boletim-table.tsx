import { BoletimActions } from './boletim-actions'

type HomologacaoItem = {
  id: string
  ano: number
  mes: number
  status: string
  homologadaEm: Date | null
  unidade: {
    sigla: string
    nome: string
  }
  homologador: {
    nome: string
  } | null
  servidores: Array<{
    servidor: {
      nomeFuncional: string
      matricula: string
    }
  }>
}

type Props = {
  homologacoes: HomologacaoItem[]
}

function formatarData(data: Date | null) {
  if (!data) return '-'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(data)
}

export function HomologacoesSemBoletimTable({ homologacoes }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Homologações pendentes de boletim
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Competência</th>
              <th className="px-4 py-3">Unidade</th>
              <th className="px-4 py-3">Homologador</th>
              <th className="px-4 py-3">Homologada em</th>
              <th className="px-4 py-3">Servidores</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {homologacoes.map((homologacao) => (
              <tr key={homologacao.id}>
                <td className="px-4 py-3 font-semibold">
                  {String(homologacao.mes).padStart(2, '0')}/{homologacao.ano}
                </td>

                <td className="px-4 py-3">
                  {homologacao.unidade.sigla}
                </td>

                <td className="px-4 py-3">
                  {homologacao.homologador?.nome ?? '-'}
                </td>

                <td className="px-4 py-3">
                  {formatarData(homologacao.homologadaEm)}
                </td>

                <td className="px-4 py-3">
                  {homologacao.servidores.length}
                </td>

                <td className="px-4 py-3">
                  <BoletimActions
                    homologacaoId={homologacao.id}
                    statusHomologacao={homologacao.status}
                  />
                </td>
              </tr>
            ))}

            {homologacoes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Nenhuma homologação pendente de boletim.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}