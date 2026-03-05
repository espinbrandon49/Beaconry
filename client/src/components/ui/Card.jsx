export default function Card({ className = "", ...props }) {
  return (
    <div
      className={[
        "bg-white border border-slate-200 rounded-lg shadow-sm p-4",
        className,
      ].join(" ")}
      {...props}
    />
  );
}