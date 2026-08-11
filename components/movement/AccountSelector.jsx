"use client";

const accounts = [
    {
        id: "cash",
        name: "💵 Billetera",
        type: "Efectivo",
    },
    {
        id: "bcp",
        name: "🏦 BCP",
        type: "Cuenta bancaria",
    },
    {
        id: "visa",
        name: "💳 Visa BCP",
        type: "Tarjeta de crédito",
    },
];

export default function AccountSelector({
    value,
    onChange,
}) {
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

                            <p className="font-medium">
                                {account.name}
                            </p>

                            <p className="text-sm text-slate-500">
                                {account.type}
                            </p>

                        </div>

                        {value === account.id && (
                            <span className="text-blue-600 font-bold">
                                ✓
                            </span>
                        )}

                    </div>

                </button>
            ))}

            <button
                type="button"
                className="w-full rounded-xl border border-dashed p-3 text-center font-medium text-slate-600 transition hover:bg-slate-50"
            >
                ➕ Agregar cuenta
            </button>

        </div>
    );
}