export type ActionState<T = unknown> = {
  ok: boolean;
  message: string;
  data?: T;
};
