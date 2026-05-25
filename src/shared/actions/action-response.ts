import type { ActionState } from './action-state'
import { formatActionError } from '@/shared/validators/action-error'

export function actionSuccess<T>(
  message: string,
  data?: T,
): ActionState<T> {
  return {
    ok: true,
    message,
    data,
  }
}

export function actionFailure(error: unknown): ActionState {
  return {
    ok: false,
    message: formatActionError(error),
  }
}