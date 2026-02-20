/**
 * Section.jsx
 * Purpose: Enforces vertical rhythm and background layering.
 */
export default function Section({ children, muted = false, className = "" }) {
    return (
        <section
            className={`
        py-12 lg:py-24
        ${muted ? "bg-muted" : "bg-background"}
        ${className}
      `}
        >
            {children}
        </section>
    );
}
