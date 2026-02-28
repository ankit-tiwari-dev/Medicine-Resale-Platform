import { useState } from "react";


export const FormInput = ({ id, label, type = "text", value, onChange, placeholder, error, required = false, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const { className, ...otherRest } = rest;

  return (
    <div className="space-y-1.5 w-full">
      <label htmlFor={id} className="block text-sm font-medium text-primary">
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-foreground/40 ${isPassword ? "pr-10" : ""} ${className || ""}`}
          {...otherRest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <span className="text-[10px] font-black tracking-widest uppercase">{showPassword ? "HIDE" : "SHOW"}</span>

          </button>
        )}
      </div>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
};
