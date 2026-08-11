"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { createLoan } from "@/lib/finance/createLoan";
import useLoanStore from "@/stores/loanStore";

export default function LoanForm({ loan = null, onSuccess }) {
    const isEdit = Boolean(loan);

    const agregarPrestamo = useLoanStore((state) => state.agregarPrestamo);
    const actualizarPrestamo = useLoanStore((state) => state.actualizarPrestamo);
    const eliminarPrestamo = useLoanStore((state) => state.eliminarPrestamo);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            descripcion: loan?.descripcion || "",
            montoInicial: loan?.montoInicial || "",
            cuotas: loan?.cuotas || 6,
            montoCuota: loan?.montoCuota || "",
            diaPago: loan?.diaPago || 15,
            fechaInicio: loan?.fechaInicio
                ? new Date(loan.fechaInicio).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
        },
    });

    const montoInicialVal = useWatch({ control, name: "montoInicial" });
    const cuotasVal = useWatch({ control, name: "cuotas" });

    const watchMonto = Number(montoInicialVal) || 0;
    const watchCuotas = Math.max(1, Number(cuotasVal) || 1);

    // Auto calculate cuota amount if not manually overridden
    useEffect(() => {
        if (!isEdit && watchMonto > 0 && watchCuotas > 0) {
            const autoCuota = (watchMonto / watchCuotas).toFixed(2);
            setValue("montoCuota", autoCuota);
        }
    }, [watchMonto, watchCuotas, isEdit, setValue]);

    useEffect(() => {
        if (loan) {
            reset({
                descripcion: loan.descripcion,
                montoInicial: loan.montoInicial,
                cuotas: loan.cuotas,
                montoCuota: loan.montoCuota,
                diaPago: loan.diaPago || 15,
                fechaInicio: loan.fechaInicio
                    ? new Date(loan.fechaInicio).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0],
            });
        }
    }, [loan, reset]);

    function onSubmit(data) {
        if (isEdit) {
            actualizarPrestamo(loan.id, {
                descripcion: data.descripcion,
                montoInicial: Number(data.montoInicial),
                cuotas: Number(data.cuotas),
                montoCuota: Number(data.montoCuota),
                diaPago: Number(data.diaPago),
                fechaInicio: new Date(data.fechaInicio).toISOString(),
            });
        } else {
            const nuevoPrestamo = createLoan({
                descripcion: data.descripcion,
                montoInicial: data.montoInicial,
                cuotas: data.cuotas,
                montoCuota: data.montoCuota,
                diaPago: data.diaPago,
                fechaInicio: new Date(data.fechaInicio).toISOString(),
            });
            agregarPrestamo(nuevoPrestamo);
        }

        onSuccess?.();
    }

    function handleDelete() {
        if (loan && confirm(`¿Estás seguro de eliminar el préstamo "${loan.descripcion}"?`)) {
            eliminarPrestamo(loan.id);
            onSuccess?.();
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Descripción / Nombre del Préstamo
                </label>
                <input
                    type="text"
                    placeholder="Ej. Préstamo personal BCP, Crédito Vehicular"
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("descripcion", {
                        required: "Ingrese la descripción del préstamo",
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
                        placeholder="Ej. 3000.00"
                        className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("montoInicial", {
                            required: "Ingrese el monto inicial",
                            min: { value: 1, message: "Debe ser mayor a 0" },
                            valueAsNumber: true,
                        })}
                    />
                    {errors.montoInicial && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.montoInicial.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Número de cuotas
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="120"
                        placeholder="Ej. 6"
                        className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("cuotas", {
                            required: "Requerido",
                            min: { value: 1, message: "Mínimo 1 cuota" },
                            max: { value: 120, message: "Máximo 120 cuotas" },
                            valueAsNumber: true,
                        })}
                    />
                    {errors.cuotas && (
                        <p className="mt-1 text-xs text-red-500">{errors.cuotas.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Monto por cuota (S/)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Ej. 500.00"
                        className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        {...register("montoCuota", {
                            required: "Ingrese el monto de la cuota",
                            min: { value: 0.01, message: "Debe ser mayor a 0" },
                            valueAsNumber: true,
                        })}
                    />
                    {errors.montoCuota && (
                        <p className="mt-1 text-xs text-red-500">{errors.montoCuota.message}</p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Día de Pago (1-31)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="31"
                        placeholder="Ej. 15"
                        className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("diaPago", {
                            required: "Requerido",
                            min: { value: 1, message: "Mín. 1" },
                            max: { value: 31, message: "Máx. 31" },
                            valueAsNumber: true,
                        })}
                    />
                    {errors.diaPago && (
                        <p className="mt-1 text-xs text-red-500">{errors.diaPago.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Fecha de inicio
                </label>
                <input
                    type="date"
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    {...register("fechaInicio", { required: "Seleccione una fecha" })}
                />
            </div>

            <div className="pt-2 space-y-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isEdit ? "Guardar cambios" : "💰 Crear préstamo"}
                </button>

                {isEdit && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full rounded-xl border border-red-200 bg-red-50 py-3 font-semibold text-red-600 transition hover:bg-red-100"
                    >
                        🗑️ Eliminar préstamo
                    </button>
                )}
            </div>
        </form>
    );
}
