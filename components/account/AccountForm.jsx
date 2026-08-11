"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import useAccountStore from "@/stores/accountStore";
import { createAccount } from "@/lib/finance/createAccount";

const accountTypes = [
    {
        id: "cash",
        name: "💵 Efectivo",
    },
    {
        id: "bank",
        name: "🏦 Cuenta bancaria",
    },
    {
        id: "credit_card",
        name: "💳 Tarjeta de crédito",
    },
];

export default function AccountForm({
    account = null,
    onSuccess,
}) {
    const [type, setType] = useState(
        account?.tipo || "cash"
    );

    const agregarCuenta = useAccountStore(
        (state) => state.agregarCuenta
    );

    const actualizarCuenta = useAccountStore(
        (state) => state.actualizarCuenta
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            nombre: account?.nombre || "",
            saldoInicial: account?.saldoInicial || "",
            limiteCredito: account?.limiteCredito || "",
            fechaCierre: account?.fechaCierre || "",
            fechaPago: account?.fechaPago || "",
        },
    });

    function onSubmit(data) {
        const datosCuenta = {
            nombre: data.nombre.trim(),
            tipo: type,
            saldoInicial: Number(data.saldoInicial) || 0,
            limiteCredito:
                type === "credit_card"
                    ? Number(data.limiteCredito) || 0
                    : null,
            fechaCierre:
                type === "credit_card"
                    ? Number(data.fechaCierre) || null
                    : null,
            fechaPago:
                type === "credit_card"
                    ? Number(data.fechaPago) || null
                    : null,
        };

        if (account) {
            actualizarCuenta(
                account.id,
                datosCuenta
            );
        } else {
            agregarCuenta(
                createAccount(datosCuenta)
            );
        }

        reset();

        setType("cash");

        onSuccess?.();
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            {/* Nombre */}

            <div>
                <label className="block mb-2 font-medium">
                    Nombre
                </label>

                <input
                    type="text"
                    placeholder="Ej. BCP Ahorros"
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("nombre", {
                        required:
                            "Ingrese el nombre de la cuenta",
                    })}
                />

                {errors.nombre && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.nombre.message}
                    </p>
                )}
            </div>

            {/* Tipo */}

            <div>
                <label className="block mb-2 font-medium">
                    Tipo de cuenta
                </label>

                <div className="grid gap-2">
                    {accountTypes.map((accountType) => (
                        <button
                            key={accountType.id}
                            type="button"
                            onClick={() =>
                                setType(accountType.id)
                            }
                            className={`rounded-xl border p-3 text-left transition ${type === accountType.id
                                    ? "border-blue-600 bg-blue-50"
                                    : "bg-white hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>
                                    {accountType.name}
                                </span>

                                {type === accountType.id && (
                                    <span className="font-bold text-blue-600">
                                        ✓
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Saldo inicial */}

            <div>
                <label className="block mb-2 font-medium">
                    Saldo inicial
                </label>

                <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("saldoInicial", {
                        min: {
                            value: 0,
                            message:
                                "El saldo no puede ser negativo",
                        },
                    })}
                />

                {errors.saldoInicial && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.saldoInicial.message}
                    </p>
                )}
            </div>

            {/* Datos de tarjeta */}

            {type === "credit_card" && (
                <div className="space-y-5">

                    <div>
                        <label className="block mb-2 font-medium">
                            Límite de crédito
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            placeholder="8000.00"
                            className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register(
                                "limiteCredito",
                                {
                                    required:
                                        "Ingrese el límite de crédito",
                                    min: {
                                        value: 0,
                                        message:
                                            "El límite no puede ser negativo",
                                    },
                                }
                            )}
                        />

                        {errors.limiteCredito && (
                            <p className="mt-1 text-sm text-red-500">
                                {
                                    errors.limiteCredito
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Día de cierre
                        </label>

                        <input
                            type="number"
                            min="1"
                            max="31"
                            placeholder="25"
                            className="w-full rounded-xl border p-3"
                            {...register(
                                "fechaCierre",
                                {
                                    required:
                                        "Ingrese el día de cierre",
                                    min: {
                                        value: 1,
                                        message:
                                            "Debe estar entre 1 y 31",
                                    },
                                    max: {
                                        value: 31,
                                        message:
                                            "Debe estar entre 1 y 31",
                                    },
                                }
                            )}
                        />

                        {errors.fechaCierre && (
                            <p className="mt-1 text-sm text-red-500">
                                {
                                    errors.fechaCierre
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Día de pago
                        </label>

                        <input
                            type="number"
                            min="1"
                            max="31"
                            placeholder="10"
                            className="w-full rounded-xl border p-3"
                            {...register(
                                "fechaPago",
                                {
                                    required:
                                        "Ingrese el día de pago",
                                    min: {
                                        value: 1,
                                        message:
                                            "Debe estar entre 1 y 31",
                                    },
                                    max: {
                                        value: 31,
                                        message:
                                            "Debe estar entre 1 y 31",
                                    },
                                }
                            )}
                        />

                        {errors.fechaPago && (
                            <p className="mt-1 text-sm text-red-500">
                                {
                                    errors.fechaPago
                                        .message
                                }
                            </p>
                        )}
                    </div>

                </div>
            )}

            {/* Guardar */}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
                {account
                    ? "Guardar cambios"
                    : "Guardar cuenta"}
            </button>
        </form>
    );
}