import Link from "next/link";

// Friendly "nothing here yet" box. Works in server and client components.
export default function EmptyState({
  icon: Icon,
  title,
  message,
  actions = [],
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Icon size={30} />
        </div>
      )}
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-base-content/70">{message}</p>
      {actions.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`btn ${action.primary ? "btn-primary" : "btn-outline"}`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
