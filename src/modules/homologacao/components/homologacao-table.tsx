type ItemHomologacao = {
    id: string
    possuiPendencia: boolean
    homologado: boolean
    observacao: string | null
    servidor: {
      matricula: string
      nomeFuncional: string
    }
  }
  
  type Props = {
    itens: ItemHomologacao[]
  }
  
  export function HomologacaoTable({ itens }: Props) {
    return (
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Servidores da homologação
          </h2>
        </div>
  
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Matrícula</th>
                <th className="px-4 py-3">Servidor</th>
                <th className="px-4 py-3">Pendência</th>
                <th className="px-4 py-3">Homologado</th>
                <th className="px-4 py-3">Observação</th>
              </tr>
            </thead>
  
            <tbody className="divide-y divide-slate-100">
              {itens.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-semibold">
                    {item.servidor.matricula}
                  </td>
                  <td className="px-4 py-3">
                    {item.servidor.nomeFuncional}
                  </td>
                  <td className="px-4 py-3">
                    {item.possuiPendencia ? 'Sim' : 'Não'}
                  </td>
                  <td className="px-4 py-3">
                    {item.homologado ? 'Sim' : 'Não'}
                  </td>
                  <td className="px-4 py-3">
                    {item.observacao ?? '-'}
                  </td>
                </tr>
              ))}
  
              {itens.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Nenhum servidor incluído na homologação.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }