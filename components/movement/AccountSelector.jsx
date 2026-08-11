"use client";

import Link from "next/link";

import useAccountStore from "@/stores/accountStore";

function getAccountTypeLabel(type) {
    if (type === "credit_card") return "Tarjeta de crédito";
    if (type === "bank") return "Cuenta bancaria";

    return "Efectivo";
}

export default function AccountSelector({ value, onChange }) {
    const accounts = useAccountStore((state) => state.cuentas);

    if (accounts.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-4 text-center">
                <p className="font-medium">Aún no tienes cuentas</p>

                <p className="mt-1 text-sm text-slate-500">
                    Crea una cuenta antes de registrar un movimiento.
                </p>

                <Link
                    href="/accounts"
                    className="mt-3 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Crear cuenta
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-2">
            {accounts.map((account) => (
                <button
                    key={account.id}
                    type="button"
                    onClick={() => onChange(account.id)}
                    className={`w-full rounded-xl border p-3 text-left transition ${value === account.id
                        ? "border-blue-600 bg-blue-50"
                        : "bg-white hover:bg-slate-50"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{account.nombre}</p>

                            <p className="text-sm text-slate-500">
                                {getAccountTypeLabel(account.tipo)}
                            </p>
                        </div>

                        {value === account.id && (
                            <span className="font-bold text-blue-600">✓</span>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}
