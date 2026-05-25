'use client'

import { useActionState } from 'react'
import type { TipoMarcacao } from '@prisma-generated/client'
import { createMarcacao } from '../actions/create-marcacao'
import { ActionFeedback } from '@/shared/ui/action-feedback'
import type { ActionState } from '@/shared/actions/action-state'

type Props = {
  tipo: TipoMarcacao
  label: string
}

const initialState: ActionState = {
  ok: false,
  message: '',
}

export function RegistroPontoButton({ tipo, label }: Props) {
  const [state, formAction, isPending] = useActionState(
    createMarcacao,
    initialState,
  )

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="tipo" value={tipo} />

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {isPending ? 'Registrando...' : label}
      </button>

      <ActionFeedback state={state} />
    </form>
  )
}