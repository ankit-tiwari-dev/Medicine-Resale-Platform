/**
 * AppShell.jsx
 * Purpose: Global layout wrapper that controls background, global tone, and prevents layout shift.
 */
export default function AppShell({ children }) {
    return (
        <div className="min-h-screen bg-background text-foreground antialiased selection:bg-info/10 selection:text-info">
            {children}
        </div>
    );
}
