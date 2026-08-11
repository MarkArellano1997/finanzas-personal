"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import useFinanceStore from "@/stores/financeStore";
import useCategoryStore from "@/stores/categoryStore";
import { createMovement } from "@/lib/finance/createMovement";

import CategorySelector from "./CategorySelector";
import AccountSelector from "./AccountSelector";

export default function MovementForm({
    onSuccess,
}) {
    const [type, setType] = useState("expense");
    const [categoryId, setCategoryId] = useState(null);
    const [accountId, setAccountId] = useState("cash");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const agregarMovimiento = useFinanceStore(
        (state) => state.agregarMovimiento
    );

    const categories = useCategoryStore((state) => state.categorias);

    const selectedCategoryId = categories.some(
        (category) => category.id === categoryId
    )
        ? categoryId
        : categories[0]?.id || null;

    function onSubmit(data) {
        agregarMovimiento(
            createMovement({
                type,
                amount: data.amount,
                description: data.description,

                categoryId:
                    type === "expense"
                        ? selectedCategoryId
                        : null,

                accountId,
            })
        );

        reset();

        setCategoryId(null);
        setAccountId("cash");
        setType("expense");

        onSuccess?.();
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 mt-5"
        >
            <div className="grid grid-cols-2 gap-3">

                <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={`rounded-xl border py-3 font-semibold transition ${type === "expense"
                            ? "bg-blue-600 text-white"
                            : "bg-white hover:bg-slate-100"
                        }`}
                >
                    📉 Gasto
                </button>

                <button
                    type="button"
                    onClick={() => setType("income")}
                    className={`rounded-xl border py-3 font-semibold transition ${type === "income"
                            ? "bg-green-600 text-white"
                            : "bg-white hover:bg-slate-100"
                        }`}
                >
                    📈 Ingreso
                </button>

            </div>

            <div>

                <label className="block mb-2 font-medium">
                    Monto
                </label>

                <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("amount", {
                        required: "Ingrese un monto",
                        min: {
                            value: 0.01,
                            message: "El monto debe ser mayor a 0",
                        },
                        valueAsNumber: true,
                    })}
                />

                {errors.amount && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.amount.message}
                    </p>
                )}

            </div>

            {type === "expense" && (
                <div>

                    <label className="block mb-2 font-medium">
                        Categoría
                    </label>

                    <CategorySelector
                        value={selectedCategoryId}
                        onChange={setCategoryId}
                    />

                </div>
            )}

            <div>

                <label className="block mb-2 font-medium">
                    Cuenta
                </label>

                <AccountSelector
                    value={accountId}
                    onChange={setAccountId}
                />

            </div>

            <div>

                <label className="block mb-2 font-medium">
                    Descripción
                </label>

                <input
                    type="text"
                    placeholder="Ej. Almuerzo"
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("description")}
                />

            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-xl py-3 font-semibold text-white transition ${type === "expense"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-green-600 hover:bg-green-700"
                    } disabled:opacity-50`}
            >
                {type === "expense"
                    ? "📉 Registrar gasto"
                    : "📈 Registrar ingreso"}
            </button>

        </form>
    );
}
