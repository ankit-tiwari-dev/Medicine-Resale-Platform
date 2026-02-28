import React from 'react';
import Button from './Button';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Commence Action",
    cancelLabel = "Abort Operation",
    variant = "danger", // danger, warning, info
    loading = false
}) => {
    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    accent: "border-soft-red",
                    button: "bg-soft-red hover:bg-soft-red/90 text-white shadow-lg shadow-soft-red/20"
                };
            case 'warning':
                return {
                    accent: "border-muted-amber",
                    button: "bg-muted-amber hover:bg-muted-amber/90 text-white shadow-lg shadow-muted-amber/20"
                };
            default:
                return {
                    accent: "border-primary",
                    button: "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300">
            <div className={`bg-card border-t-4 ${styles.accent} rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300`}>
                {/* Header Area */}
                <div className="pt-12 pb-6 flex flex-col items-center">
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
