"use client";

export default function ApproveButton({
  color,
  approving,
  onApprove,
}: {
  color: string;
  approving: boolean;
  onApprove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onApprove}
      disabled={approving}
      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:brightness-105 active:scale-[0.97] disabled:cursor-wait disabled:opacity-70"
      style={{ backgroundColor: color }}
    >
      {approving ? "Approving…" : "Approve"}
      {!approving && <span aria-hidden="true">→</span>}
    </button>
  );
}
