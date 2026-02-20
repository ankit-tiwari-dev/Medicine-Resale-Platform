export const AlertMessage = ({ variant = "error", message }) => {
  if (!message) return null;
  const styles =
    variant === "warning"
      ? "border-warning bg-amber-50 text-amber-700"
      : "border-danger bg-red-50 text-red-700";

  return <div className={`rounded-lg border px-3 py-2 text-sm ${styles}`}>{message}</div>;
};
