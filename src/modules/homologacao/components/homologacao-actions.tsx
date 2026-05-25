'use client'

import { useTransition } from 'react'
import { gerarHomologacaoMensal } from '../actions/gerar-homologacao-mensal'
import { fecharHomologacaoMensal } from '../actions/fechar-homologacao-mensal'

type Props = {
  unidadeId: string
  ano: number
  mes: number
  homologacaoId?: string
  podeFechar: boolean
}

export function HomologacaoActions({
  unidadeId,
  ano,
  mes,
  homologacaoId,
  podeFechar,
}: Props) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await gerarHomologacaoMensal(unidadeId, ano, mes)
            window.location.reload()
          })
        }}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Gerar/atualizar homologação
      </button>

      {homologacaoId && (
        <button
          type="button"
          disabled={isPending || !podeFechar}
          onClick={() => {
            startTransition(async () => {
              await fecharHomologacaoMensal(homologacaoId)
              window.location.reload()
            })
          }}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          Fechar homologação
        </button>
      )}
    </div>
  )
}