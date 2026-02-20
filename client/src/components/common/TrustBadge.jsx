/**
 * TrustBadge.jsx
 * Trust-first badge system for verification status and enterprise labels.
 */
export default function TrustBadge({
    children,
    variant = "info",
    className = "",
}) {
    const variants = {
        info: "bg-info/5 text-info ring-info/20",
        success: "bg-success/5 text-success ring-success/20",
        warning: "bg-warning/5 text-warning ring-warning/20",
        danger: "bg-danger/5 text-danger ring-danger/20",
        neutral: "bg-surface-muted text-foreground-muted ring-border",
    };

    return (
        <span
            className={`
        inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset
        ${variants[variant]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}
