"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { createCard } from "@/lib/finance/createCard";
import useCardStore from "@/stores/cardStore";

export default function CardForm({ card = null, onSuccess }) {
    const isEdit = Boolean(card);

    const agregarTarjeta = useCardStore((state) => state.agregarTarjeta);
    const actualizarTarjeta = useCardStore((state) => state.actualizarTarjeta);
    const eliminarTarjeta = useCardStore((state) => state.eliminarTarjeta);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            nombre: card?.nombre || "",
            limiteCredito: card?.limiteCredito || "",
            diaCierre: card?.diaCierre || 15,
            diaPago: card?.diaPago || 5,
        },
    });

    useEffect(() => {
        if (card) {
            reset({
                nombre: card.nombre,
                limiteCredito: card.limiteCredito,
                diaCierre: card.diaCierre,
                diaPago: card.diaPago,
            });
        }
    }, [card, reset]);

    function onSubmit(data) {
        if (isEdit) {
            actualizarTarjeta(card.id, {
                nombre: data.nombre,
                limiteCredito: Number(data.limiteCredito),
                diaCierre: Number(data.diaCierre),
                diaPago: Number(data.diaPago),
            });
        } else {
            const nuevaTarjeta = createCard({
                nombre: data.nombre,
                limiteCredito: data.limiteCredito,
                diaCierre: data.diaCierre,
                diaPago: data.diaPago,
            });
            agregarTarjeta(nuevaTarjeta);
        }

        onSuccess?.();
    }

    function handleDelete() {
        if (card && confirm(`¿Estás seguro de eliminar la tarjeta "${card.nombre}"?`)) {
            eliminarTarjeta(card.id);
            onSuccess?.();
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Nombre de la tarjeta
                </label>
                <input
                    type="text"
                    placeholder="Ej. Visa BCP Gold"
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("nombre", {
                        required: "Ingrese el nombre de la tarjeta",
                    })}
                />
                {errors.nombre && (
                    <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Límite de crédito (S/)
                </label>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Ej. 5000.00"
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("limiteCredito", {
                        required: "Ingrese el límite de crédito",
                        min: {
                            value: 1,
                            message: "El límite debe ser mayor a 0",
                        },
                        valueAsNumber: true,
                    })}
                />
                {errors.limiteCredito && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.limiteCredito.message}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                        Día de Cierre (1-31)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="31"
                        placeholder="Ej. 15"
                        className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("diaCierre", {
                            required: "Requerido",
                            min: { value: 1, message: "Mín. 1" },
                            max: { value: 31, message: "Máx. 31" },
                            valueAsNumber: true,
                        })}
                    />
                    {errors.diaCierre && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.diaCierre.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                        Día de Pago (1-31)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="31"
                        placeholder="Ej. 5"
                        className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("diaPago", {
                            required: "Requerido",
                            min: { value: 1, message: "Mín. 1" },
                            max: { value: 31, message: "Máx. 31" },
                            valueAsNumber: true,
                        })}
                    />
                    {errors.diaPago && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.diaPago.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="pt-2 space-y-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                    {isEdit ? "Guardar cambios" : "💳 Crear tarjeta"}
                </button>

                {isEdit && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full rounded-xl border border-red-200 bg-red-50 py-3 font-semibold text-red-600 transition hover:bg-red-100"
                    >
                        🗑️ Eliminar tarjeta
                    </button>
                )}
            </div>
        </form>
    );
}
