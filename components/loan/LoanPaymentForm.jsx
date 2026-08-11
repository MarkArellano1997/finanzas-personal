"use client";

import { useForm, useWatch } from "react-hook-form";

import { createLoanPayment } from "@/lib/finance/createLoan";
import { createMovement } from "@/lib/finance/createMovement";
import { getLoanMetrics } from "@/lib/finance/loanBalance";
import useLoanStore from "@/stores/loanStore";
import useAccountStore from "@/stores/accountStore";
import useFinanceStore from "@/stores/financeStore";

export default function LoanPaymentForm({ defaultLoanId = null, onSuccess }) {
    const prestamos = useLoanStore((state) => state.prestamos);
    const pagos = useLoanStore((state) => state.pagos);
    const registrarPagoPrestamo = useLoanStore((state) => state.registrarPagoPrestamo);

    const accounts = useAccountStore((state) => state.cuentas);
    const agregarMovimiento = useFinanceStore((state) => state.agregarMovimiento);

    const selectedLoanId = defaultLoanId || prestamos[0]?.id || "";
    const loanSelected = prestamos.find((p) => p.id === selectedLoanId);
    const metrics = loanSelected ? getLoanMetrics(loanSelected, pagos) : null;

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            loanId: selectedLoanId,
            monto: metrics?.proximaCuotaMonto ? metrics.proximaCuotaMonto : "",
            accountId: accounts[0]?.id || "",
            descripcion: "Pago de cuota de préstamo",
            fecha: new Date().toISOString().split("T")[0],
        },
    });

    const currentLoanId = useWatch({ control, name: "loanId" });
    const currentLoan = prestamos.find((p) => p.id === currentLoanId);
    const currentMetrics = currentLoan ? getLoanMetrics(currentLoan, pagos) : null;

    function handleSelectInstallment() {
        if (currentMetrics) {
            setValue("monto", currentMetrics.proximaCuotaMonto);
        }
    }

    function handleSelectTotalPending() {
        if (currentMetrics) {
            setValue("monto", currentMetrics.saldoPendiente);
        }
    }

    function onSubmit(data) {
        const nuevoPago = createLoanPayment({
            loanId: data.loanId,
            monto: data.monto,
            accountId: data.accountId || null,
            descripcion: data.descripcion || `Pago cuota ${currentLoan?.descripcion || "préstamo"}`,
            fecha: new Date(data.fecha).toISOString(),
        });

        registrarPagoPrestamo(nuevoPago);

        if (data.accountId) {
            agregarMovimiento(
                createMovement({
                    type: "expense",
                    amount: Number(data.monto),
                    description: `Pago ${currentLoan?.descripcion || "préstamo"}`,
                    accountId: data.accountId,
                    categoryId: null,
                })
            );
        }

        reset();
        onSuccess?.();
    }

    if (prestamos.length === 0) {
        return (
            <div className="py-6 text-center text-slate-500">
                No tienes préstamos registrados para pagar.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Préstamo a pagar
                </label>
                <select
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    {...register("loanId", { required: "Seleccione un préstamo" })}
                >
                    {prestamos.map((p) => {
                        const m = getLoanMetrics(p, pagos);
                        return (
                            <option key={p.id} value={p.id}>
                                {p.descripcion} (Pendiente: S/ {m.saldoPendiente.toFixed(2)})
                            </option>
                        );
                    })}
                </select>
                {errors.loanId && (
                    <p className="mt-1 text-xs text-red-500">{errors.loanId.message}</p>
                )}
            </div>

            {currentMetrics && (
                <div className="rounded-xl border bg-indigo-50 p-3 text-xs text-indigo-900 space-y-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">Cuota sugerida:</p>
                            <p className="text-base font-extrabold text-indigo-950">
                                S/ {currentMetrics.proximaCuotaMonto.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-right">Saldo pendiente:</p>
                            <p className="text-sm font-bold text-rose-700 text-right">
                                S/ {currentMetrics.saldoPendiente.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-1 border-t border-indigo-200">
                        <button
                            type="button"
                            onClick={handleSelectInstallment}
                            className="flex-1 rounded-lg bg-indigo-200 py-1.5 font-bold text-indigo-900 hover:bg-indigo-300 transition text-center"
                        >
                            Pagar 1 cuota
                        </button>
                        <button
                            type="button"
                            onClick={handleSelectTotalPending}
                            className="flex-1 rounded-lg bg-emerald-200 py-1.5 font-bold text-emerald-900 hover:bg-emerald-300 transition text-center"
                        >
                            Liquidar total
                        </button>
                    </div>
                </div>
            )}

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Monto a pagar (S/)
                </label>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Ej. 500.00"
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
                    <option value="">Ninguna (Solo registrar pago de préstamo)</option>
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
                    placeholder="Ej. Pago de cuota 2"
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
                💰 Registrar pago de cuota
            </button>
        </form>
    );
}
