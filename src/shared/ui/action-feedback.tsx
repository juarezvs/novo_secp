import type { ActionState } from '@/shared/actions/action-state'

type Props = {
  state: ActionState
}

export function ActionFeedback({ state }: Props) {
  if (!state.message) return null

  return (
    <div
      className={`rounded-lg p-3 text-sm ${
        state.ok
          ? 'bg-emerald-50 text-emerald-800'
          : 'bg-red-50 text-red-800'
      }`}
    >
      {state.message}
    </div>
  )
}