"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuTrash2 } from "react-icons/lu";
import { apiRequest } from "@/app/lib/client-api";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function DeleteStudioButton({ studioId, title }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await apiRequest(`/studios/${studioId}`, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    toast.success("Studio deleted successfully.");
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-sm btn-error btn-outline"
        aria-label={`Delete ${title}`}
      >
        <LuTrash2 size={15} />
        Delete
      </button>
      <ConfirmModal
        open={open}
        title="Delete this studio?"
        message={`“${title}” will be removed for good, and any open booking requests for it will be cancelled. This can’t be undone.`}
        confirmLabel="Yes, delete it"
        loading={loading}
        onConfirm={handleDelete}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
