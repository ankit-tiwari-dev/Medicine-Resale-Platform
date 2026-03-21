import { useState } from "react";


export const FormInput = ({ id, label, type = "text", value, onChange, placeholder, error, required = false, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isNumber = type === "number";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const { className, step = 1, min, max, ...otherRest } = rest;

  const handleAdjust = (adjustment) => {
    const currentValue = Number(value) || 0;
    const newValue = currentValue + adjustment;
    
    if (min !== undefined && newValue < Number(min)) return;
    if (max !== undefined && newValue > Number(max)) return;

    // Trigger synthetic event for compatibility
    if (onChange) {
      onChange({
        target: {
          id,
          name: id,
          value: newValue.toString()
        }
      });
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-primary opacity-70">
        {label}
      </label>
      <div className="relative w-full group">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 ${isPassword || isNumber ? "pr-12" : ""} ${className || ""}`}
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
        {isNumber && (
          <div className="absolute right-1 top-1 bottom-1 flex flex-col gap-0.5 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => handleAdjust(Number(step))}
              className="flex-1 bg-muted/20 hover:bg-primary/10 px-2 rounded-tr-lg rounded-br-sm text-foreground/40 hover:text-primary transition-all flex items-center justify-center"
            >
              <span className="text-[10px] leading-none">▲</span>
            </button>
            <button
              type="button"
              onClick={() => handleAdjust(-Number(step))}
              className="flex-1 bg-muted/20 hover:bg-primary/10 px-2 rounded-br-lg rounded-tr-sm text-foreground/40 hover:text-primary transition-all flex items-center justify-center border-t border-border/50"
            >
              <span className="text-[10px] leading-none">▼</span>
            </button>
          </div>
        )}
      </div>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
};
