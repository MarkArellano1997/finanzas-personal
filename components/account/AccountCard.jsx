"use client";

import useAccountStore from "@/stores/accountStore";

export default function AccountCard({
    account,
    onEdit,
}) {
    const eliminarCuenta = useAccountStore(
        (state) => state.eliminarCuenta
    );

    function handleDelete() {
        const confirmar = window.confirm(
            `¿Eliminar la cuenta "${account.nombre}"?`
        );

        if (!confirmar) return;

        eliminarCuenta(account.id);
    }

    const saldoInicial = Number(account.saldoInicial) || 0;

    const esTarjeta = account.tipo === "credit_card";

    return (
        <article className="rounded-2xl border bg-white p-4 shadow-sm">

            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                    <p className="text-sm text-slate-500">
                        {esTarjeta
                            ? "Tarjeta de crédito"
                            : account.tipo === "bank"
                                ? "Cuenta bancaria"
                                : "Efectivo"}
                    </p>

                    <h3 className="mt-1 truncate text-lg font-semibold">
                        {account.nombre}
                    </h3>

                </div>

                <div className="text-right">

                    <p className="text-xs text-slate-500">
                        Saldo inicial
                    </p>

                    <p className="text-lg font-bold">
                        S/ {saldoInicial.toFixed(2)}
                    </p>

                </div>

            </div>

            {esTarjeta && (
                <div className="mt-4 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-xs text-slate-500">
                            Límite
                        </p>

                        <p className="mt-1 font-semibold">
                            S/{" "}
                            {(
                                Number(
                                    account.limiteCredito
                                ) || 0
                            ).toFixed(2)}
                        </p>

                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-xs text-slate-500">
                            Pago
                        </p>

                        <p className="mt-1 font-semibold">
                            Día {account.fechaPago || "-"}
                        </p>

                    </div>

                </div>
            )}

            <div className="mt-4 flex gap-2">

                <button
                    type="button"
                    onClick={() => onEdit?.(account)}
                    className="flex-1 rounded-xl border py-2 text-sm font-medium transition hover:bg-slate-50"
                >
                    ✏️ Editar
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 rounded-xl border border-red-200 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                    🗑️ Eliminar
                </button>

            </div>

        </article>
    );
}