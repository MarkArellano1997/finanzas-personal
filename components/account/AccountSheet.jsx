"use client";

import AccountForm from "./AccountForm";

export default function AccountSheet({
    open,
    onOpenChange,
    account = null,
}) {
    if (!open) return null;

    function handleClose() {
        onOpenChange(false);
    }

    return (
        <div className="fixed inset-0 z-50">

            {/* Fondo */}
            <button
                type="button"
                aria-label="Cerrar"
                onClick={handleClose}
                className="absolute inset-0 h-full w-full bg-black/40"
            />

            {/* Sheet */}
            <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-md rounded-t-3xl bg-white p-5 shadow-xl">

                <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-300" />

                <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-xl font-bold">
                        {account
                            ? "Editar cuenta"
                            : "Nueva cuenta"}
                    </h2>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg hover:bg-slate-200"
                    >
                        ✕
                    </button>

                </div>

                <AccountForm
                    account={account}
                    onSuccess={handleClose}
                />

            </div>

        </div>
    );
}