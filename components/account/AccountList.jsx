"use client";

import useAccountStore from "@/stores/accountStore";
import AccountCard from "./AccountCard";

export default function AccountList({
    onEdit,
}) {
    const cuentas = useAccountStore(
        (state) => state.cuentas
    );

    if (cuentas.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed bg-white p-8 text-center">
                <div className="text-4xl">
                    💰
                </div>

                <h3 className="mt-3 font-semibold">
                    No tienes cuentas todavía
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Agrega tu primera cuenta para comenzar
                    a controlar tu dinero.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {cuentas.map((account) => (
                <AccountCard
                    key={account.id}
                    account={account}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}