"use client";

import { getSaldoCuenta } from "@/lib/finance/balance";
import { formatCurrency } from "@/lib/format/currency";
import useAccountStore from "@/stores/accountStore";
import useFinanceStore from "@/stores/financeStore";

function getAccountTypeLabel(type) {
    if (type === "credit_card") return "Tarjeta de crédito";
    if (type === "bank") return "Cuenta bancaria";

    return "Efectivo";
}

export default function AccountsSection() {
    const cuentas = useAccountStore((state) => state.cuentas);
    const movimientos = useFinanceStore((state) => state.movimientos);

    return (
        <section className="space-y-3">
            <h2 className="text-xl font-bold">Mis cuentas</h2>

            {cuentas.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-white p-6 text-center">
                    <p className="text-slate-500">
                        Aún no registras cuentas.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {cuentas.map((cuenta) => (
                        <article
                            key={cuenta.id}
                            className="rounded-2xl border bg-white p-4 shadow-sm"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="truncate font-semibold">
                                        {cuenta.nombre}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {getAccountTypeLabel(cuenta.tipo)}
                                    </p>
                                </div>

                                <strong className="shrink-0">
                                    {formatCurrency(
                                        getSaldoCuenta(cuenta, movimientos)
                                    )}
                                </strong>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
