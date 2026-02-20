import React from 'react';
import { Lock } from 'lucide-react';

/**
 * AuthCard.jsx
 * High-elevation trust object for secure data entry.
 * Purpose: Centered focus, medical-grade elevation, and security signals.
 */
export default function AuthCard({ children, title, subtitle }) {
    return (
        <div className="w-full space-y-8">
            <div className="space-y-8">
                <div className="space-y-3">
                    <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground text-center tracking-tight leading-tight">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground text-center font-sans max-w-[320px] mx-auto leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="space-y-6 font-sans">
                    {children}
                </div>
            </div>
        </div>
    );
}
