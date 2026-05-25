type Unidade = {
    id: string
    sigla: string
    nome: string
    tipo: string
    ativa: boolean
    orgao: {
      sigla: string
    }
    unidadePai: {
      sigla: string
      nome: string
    } | null
    _count: {
      subunidades: number
      lotacoes: number
    }
  }
  
  type UnidadesTableProps = {
    unidades: Unidade[]
  }
  
  export function UnidadesTable({ unidades }: UnidadesTableProps) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Unidades cadastradas
          </h2>
        </div>
  
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Sigla</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Órgão</th>
                <th className="px-4 py-3">Superior</th>
                <th className="px-4 py-3">Subunidades</th>
                <th className="px-4 py-3">Servidores</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
  
            <tbody className="divide-y divide-slate-100">
              {unidades.map((unidade) => (
                <tr key={unidade.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {unidade.sigla}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {unidade.nome}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {unidade.tipo}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {unidade.orgao.sigla}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {unidade.unidadePai?.sigla ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {unidade._count.subunidades}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {unidade._count.lotacoes}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {unidade.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                </tr>
              ))}
  
              {unidades.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Nenhuma unidade cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }