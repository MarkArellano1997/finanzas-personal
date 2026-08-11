"use client";

import { useForm, useWatch } from "react-hook-form";

import { createCardPayment } from "@/lib/finance/createCard";
import { createMovement } from "@/lib/finance/createMovement";
import { getCardMetrics } from "@/lib/finance/cardBalance";
import useCardStore from "@/stores/cardStore";
import useAccountStore from "@/stores/accountStore";
import useFinanceStore from "@/stores/financeStore";

export default function CardPaymentForm({ defaultCardId = null, onSuccess }) {
    const tarjetas = useCardStore((state) => state.tarjetas);
    const compras = useCardStore((state) => state.compras);
    const pagos = useCardStore((state) => state.pagos);
    const registrarPago = useCardStore((state) => state.registrarPago);

    const accounts = useAccountStore((state) => state.cuentas);
    const agregarMovimiento = useFinanceStore((state) => state.agregarMovimiento);

    const selectedCardId = defaultCardId || tarjetas[0]?.id || "";
    const cardSelected = tarjetas.find((t) => t.id === selectedCardId);
    const metrics = cardSelected ? getCardMetrics(cardSelected, compras, pagos) : null;

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            cardId: selectedCardId,
            monto: metrics?.deudaActual ? metrics.deudaActual : "",
            accountId: accounts[0]?.id || "",
            descripcion: "Pago de tarjeta",
            fecha: new Date().toISOString().split("T")[0],
        },
    });

    const currentCardId = useWatch({ control, name: "cardId" });
    const currentCard = tarjetas.find((t) => t.id === currentCardId);
    const currentMetrics = currentCard ? getCardMetrics(currentCard, compras, pagos) : null;


    function handleSelectTotalDebt() {
        if (currentMetrics) {
            setValue("monto", currentMetrics.deudaActual);
        }
    }

    function onSubmit(data) {
        const nuevoPago = createCardPayment({
            cardId: data.cardId,
            monto: data.monto,
            accountId: data.accountId || null,
            descripcion: data.descripcion || `Pago de ${currentCard?.nombre || "tarjeta"}`,
            fecha: new Date(data.fecha).toISOString(),
        });

        registrarPago(nuevoPago);

        // If user selected a bank account, record movement to reduce account balance
        if (data.accountId) {
            agregarMovimiento(
                createMovement({
                    type: "expense",
                    amount: Number(data.monto),
                    description: `Pago ${currentCard?.nombre || "tarjeta"}`,
                    accountId: data.accountId,
                    categoryId: null,
                })
            );
        }

        reset();
        onSuccess?.();
    }

    if (tarjetas.length === 0) {
        return (
            <div className="py-6 text-center text-slate-500">
                No tienes tarjetas registradas para pagar.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Tarjeta a pagar
                </label>
                <select
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    {...register("cardId", { required: "Seleccione una tarjeta" })}
                >
                    {tarjetas.map((t) => {
                        const m = getCardMetrics(t, compras, pagos);
                        return (
                            <option key={t.id} value={t.id}>
                                {t.nombre} (Deuda: S/ {m.deudaActual.toFixed(2)})
                            </option>
                        );
                    })}
                </select>
                {errors.cardId && (
                    <p className="mt-1 text-xs text-red-500">{errors.cardId.message}</p>
                )}
            </div>

            {currentMetrics && (
                <div className="flex items-center justify-between rounded-xl border bg-amber-50 p-3 text-xs text-amber-900">
                    <div>
                        <p className="font-semibold">Deuda actual:</p>
                        <p className="text-base font-extrabold text-amber-800">
                            S/ {currentMetrics.deudaActual.toFixed(2)}
                        </p>
                    </div>
                    {currentMetrics.deudaActual > 0 && (
                        <button
                            type="button"
                            onClick={handleSelectTotalDebt}
                            className="rounded-lg bg-amber-200 px-3 py-1.5 font-bold text-amber-900 hover:bg-amber-300 transition"
                        >
                            Pagar total
                        </button>
                    )}
                </div>
            )}

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Monto a pagar (S/)
                </label>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Ej. 200.00"
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("monto", {
                        required: "Ingrese el monto del pago",
                        min: { value: 0.01, message: "Debe ser mayor a 0" },
                        valueAsNumber: true,
                    })}
                />
                {errors.monto && (
                    <p className="mt-1 text-xs text-red-500">{errors.monto.message}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Pagar desde cuenta (opcional)
                </label>
                <select
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    {...register("accountId")}
                >
                    <option value="">Ninguna (Solo registrar pago en tarjeta)</option>
                    {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                            {acc.nombre}
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-slate-500">
                    Si seleccionas una cuenta, se descontará el dinero de tu saldo bancario.
                </p>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Descripción / Nota
                </label>
                <input
                    type="text"
                    placeholder="Ej. Pago del mes"
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("descripcion")}
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Fecha de pago
                </label>
                <input
                    type="date"
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    {...register("fecha", { required: "Seleccione una fecha" })}
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
                💳 Registrar pago
            </button>
        </form>
    );
}
