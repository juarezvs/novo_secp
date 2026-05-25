type Props = {
  isPending: boolean;
  idleText: string;
  pendingText?: string;
};

export function SubmitButton({
  isPending,
  idleText,
  pendingText = "Salvando...",
}: Props) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
    >
      {isPending ? pendingText : idleText}
    </button>
  );
}
