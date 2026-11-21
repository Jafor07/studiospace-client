"use client";

import { LuTriangleAlert } from "react-icons/lu";

// Custom confirmation pop-up (we never use the browser's alert or confirm).
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Keep it",
  loading = false,
  onConfirm,
  onClose,
}) {
  return (
    <div className={`modal ${open ? "modal-open" : ""}`} role="dialog">
      <div className="modal-box">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-error/15 text-error">
            <LuTriangleAlert size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm text-base-content/70">{message}</p>
          </div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </button>
          <button className="btn btn-error" onClick={onConfirm} disabled={loading}>
            {loading && <span className="loading loading-spinner loading-sm" />}
            {confirmLabel}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={loading ? undefined : onClose} />
    </div>
  );
}
