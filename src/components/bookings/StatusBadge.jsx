const STYLES = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Completed: "badge-info",
  Cancelled: "badge-error",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge badge-soft font-semibold ${STYLES[status] || ""}`}>
      {status}
    </span>
  );
}
