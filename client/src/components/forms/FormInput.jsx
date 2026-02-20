export const FormInput = ({ id, label, type = "text", value, onChange, placeholder, error, required = false, ...rest }) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-primary">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        className="w-full rounded-lg border border-borderColor bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-secondary focus:ring-2 focus:ring-focusRing"
        {...rest}
      />
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
};
