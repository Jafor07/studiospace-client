// Every section on the site uses this, so all headings look the same.
export default function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && (
        <p
          className={`mt-3 max-w-2xl text-base text-base-content/70 ${
            center ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
