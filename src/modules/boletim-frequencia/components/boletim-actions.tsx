'use client'

import { useTransition } from 'react'
import { gerarBoletimFrequencia } from '../actions/gerar-boletim'
import { enviarBoletimSecap } from '../actions/enviar-boletim-secap'

type Props = {
  homologacaoId?: string
  boletimId?: string
  statusHomologacao?: string
  statusBoletim?: string
}

export function BoletimActions({
  homologacaoId,
  boletimId,
  statusHomologacao,
  statusBoletim,
}: Props) {
  const [isPending, startTransition] = useTransition()

  const podeGerar = Boolean(homologacaoId) && statusHomologacao === 'HOMOLOGADA'
  const podeEnviar = Boolean(boletimId) && statusBoletim === 'GERADO'

  return (
    <div className="flex flex-wrap gap-2">
      {podeGerar && homologacaoId && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await gerarBoletimFrequencia(homologacaoId)
              window.location.reload()
            })
          }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Gerar boletim
        </button>
      )}

      {podeEnviar && boletimId && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await enviarBoletimSecap(boletimId)
              window.location.reload()
            })
          }}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Enviar à SECAP/NUCGP
        </button>
      )}
    </div>
  )
}