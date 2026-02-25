import React from 'react';
import { ShieldAlert, AlertCircle, Trash2, X } from 'lucide-react';
import Button from './Button';

/**
 * ConfirmationModal.jsx
 * A premium, clinical-grade confirmation dialog.
 * Replaces native browser alerts with a high-trust, brand-aligned experience.
 */
const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Commence Action",
    cancelLabel = "Abort Operation",
    variant = "danger", // danger, warning, info
    loading = false,
    icon: CustomIcon
}) => {
    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: CustomIcon ? <CustomIcon className="w-10 h-10 text-soft-red" /> : <Trash2 className="w-10 h-10 text-soft-red" />,
                    accent: "bg-soft-red/10",
                    button: "bg-soft-red hover:bg-soft-red/90 text-white shadow-lg shadow-soft-red/20"
                };
            case 'warning':
                return {
                    icon: CustomIcon ? <CustomIcon className="w-10 h-10 text-muted-amber" /> : <AlertCircle className="w-10 h-10 text-muted-amber" />,
                    accent: "bg-muted-amber/10",
                    button: "bg-muted-amber hover:bg-muted-amber/90 text-white shadow-lg shadow-muted-amber/20"
                };
            default:
                return {
                    icon: CustomIcon ? <CustomIcon className="w-10 h-10 text-primary" /> : <ShieldAlert className="w-10 h-10 text-primary" />,
                    accent: "bg-primary/10",
                    button: "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300">
            <div className="bg-card border border-border rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header/Icon Area */}
                <div className="pt-12 pb-6 flex flex-col items-center">
                    <div className={`p-6 rounded-[2rem] ${styles.accent} mb-6`}>
                        {styles.icon}
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-foreground tracking-tight px-10 text-center leading-tight">
                        {title}
                    </h3>
                </div>

                {/* Message Area */}
                <div className="px-12 pb-12">
                    <p className="text-muted-foreground text-center font-medium leading-relaxed font-sans text-sm">
                        {message}
                    </p>
                </div>

                {/* Actions Area */}
                <div className="p-8 bg-muted/20 flex flex-col gap-4">
                    <Button
                        variant="primary"
                        className={`h-16 rounded-2xl font-bold flex items-center justify-center transition-all text-sm uppercase tracking-widest ${styles.button}`}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmLabel}
                    </Button>
                    <button
                        onClick={onClose}
                        className="h-12 rounded-xl font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all uppercase text-[10px] tracking-[0.2em] font-sans"
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
