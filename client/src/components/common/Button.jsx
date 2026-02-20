/**
 * Button.jsx
 * Foundational Button system with variant-based semantic styling.
 * Supports: primary, secondary, ghost, danger, success, info.
 */
export default function Button({
    className = "",
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    icon: Icon,
    children,
    ...props
}) {
    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        danger: "bg-destructive text-white hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 py-2 text-sm",
        lg: "h-10 px-6 text-base",
        icon: "h-9 w-9",
    };

    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : Icon ? (
                <span className="mr-2">
                    <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 18} />
                </span>
            ) : null}
            {children}
        </button>
    );
}
