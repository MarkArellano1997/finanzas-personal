"use client";

import { useForm, useWatch } from "react-hook-form";

import { createCardPurchase } from "@/lib/finance/createCard";
import useCardStore from "@/stores/cardStore";
import useCategoryStore from "@/stores/categoryStore";

export default function CardPurchaseForm({ defaultCardId = null, onSuccess }) {
    const tarjetas = useCardStore((state) => state.tarjetas);
    const categorias = useCategoryStore((state) => state.categorias);
    const registrarCompra = useCardStore((state) => state.registrarCompra);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            cardId: defaultCardId || tarjetas[0]?.id || "",
            descripcion: "",
            monto: "",
            cuotas: 1,
            categoryId: categorias[0]?.id || "",
            fecha: new Date().toISOString().split("T")[0],
        },
    });

    const montoVal = useWatch({ control, name: "monto" });
    const cuotasVal = useWatch({ control, name: "cuotas" });
    const watchMonto = Number(montoVal) || 0;
    const watchCuotas = Math.max(1, Number(cuotasVal) || 1);
    const montoPorCuota = watchMonto > 0 ? (watchMonto / watchCuotas).toFixed(2) : "0.00";


    function onSubmit(data) {
        const nuevaCompra = createCardPurchase({
            cardId: data.cardId,
            descripcion: data.descripcion,
            monto: data.monto,
            cuotas: data.cuotas,
            categoryId: data.categoryId,
            fecha: new Date(data.fecha).toISOString(),
        });

        registrarCompra(nuevaCompra);
        reset();
        onSuccess?.();
    }

    if (tarjetas.length === 0) {
        return (
            <div className="py-6 text-center text-slate-500">
                Debes registrar al menos una tarjeta antes de registrar una compra.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Tarjeta
                </label>
                <select
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    {...register("cardId", { required: "Seleccione una tarjeta" })}
                >
                    {tarjetas.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.nombre} (Límite: S/ {t.limiteCredito})
                        </option>
                    ))}
                </select>
                {errors.cardId && (
                    <p className="mt-1 text-xs text-red-500">{errors.cardId.message}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Descripción de la compra
                </label>
                <input
                    type="text"
                    placeholder="Ej. Laptop para el trabajo, Televisor"
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("descripcion", {
                        required: "Ingrese la descripción de la compra",
                    })}
                />
                {errors.descripcion && (
                    <p className="mt-1 text-xs text-red-500">{errors.descripcion.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Monto total (S/)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Ej. 1200.00"
                        className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("monto", {
                            required: "Ingrese el monto",
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
                        Número de cuotas
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="60"
                        placeholder="1"
                        className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("cuotas", {
                            required: "Requerido",
                            min: { value: 1, message: "Mínimo 1 cuota" },
                            max: { value: 60, message: "Máximo 60 cuotas" },
                            valueAsNumber: true,
                        })}
                    />
                    {errors.cuotas && (
                        <p className="mt-1 text-xs text-red-500">{errors.cuotas.message}</p>
                    )}
                </div>
            </div>

            {/* Cálculo previo de cuota */}
            {watchCuotas > 1 && watchMonto > 0 && (
                <div className="rounded-xl border bg-blue-50/70 p-3 text-xs text-blue-800">
                    <p className="font-semibold">💡 Desglose de cuotas:</p>
                    <p className="mt-1">
                        Pagarás <strong>{watchCuotas} cuotas</strong> de{" "}
                        <strong className="text-blue-900 font-bold">S/ {montoPorCuota}</strong> cada una.
                    </p>
                </div>
            )}

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Categoría
                </label>
                <select
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    {...register("categoryId")}
                >
                    <option value="">Sin categoría</option>
                    {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nombre || c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Fecha de compra
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
                className="w-full rounded-xl bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
            >
                🛍️ Registrar compra
            </button>
        </form>
    );
}
