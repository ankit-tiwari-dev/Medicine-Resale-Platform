export const PrimaryButton = ({ children, loading = false, disabled = false, type = "button", onClick, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex w-full items-center justify-center rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};
