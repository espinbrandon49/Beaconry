export default function Badge({ className = "", ...props }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full bg-slate-100 text-slate-700",
        "px-2 py-1 text-xs font-medium",
        className,
      ].join(" ")}
      {...props}
    />
  );
}