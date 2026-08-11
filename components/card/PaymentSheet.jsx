"use client";

import CardPaymentForm from "./CardPaymentForm";

export default function PaymentSheet({ open, onOpenChange, defaultCardId = null }) {
    if (!open) return null;

    function handleClose() {
        onOpenChange(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <button
                type="button"
                aria-label="Cerrar modal"
                onClick={handleClose}
                className="absolute inset-0 h-full w-full bg-black/40 backdrop-blur-xs"
            />

            <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white p-6 shadow-xl z-10 max-h-[90vh] overflow-y-auto">
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300 sm:hidden" />

                <div className="mb-4 flex items-center justify-between border-b pb-3">
                    <h2 className="text-xl font-bold text-slate-900">
                        💳 Registrar Pago de Tarjeta
                    </h2>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                    >
                        ✕
                    </button>
                </div>

                <CardPaymentForm defaultCardId={defaultCardId} onSuccess={handleClose} />
            </div>
        </div>
    );
}
