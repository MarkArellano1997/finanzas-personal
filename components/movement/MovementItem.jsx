"use client";

import { Trash2 } from "lucide-react";

import { categories } from "@/data/categories";
import { formatCurrency } from "@/lib/format/currency";

import useFinanceStore from "@/stores/financeStore";

export default function MovementItem({ movimiento }) {

    const eliminarMovimiento = useFinanceStore(
        (state) => state.eliminarMovimiento
    );

    const categoria = categories.find(
        (c) => c.id === movimiento.categoryId
    );

    const color =
        movimiento.type === "income"
            ? "text-green-600"
            : "text-red-600";

    const signo =
        movimiento.type === "income"
            ? "+"
            : "-";

    const fecha = new Date(
        movimiento.createdAt
    ).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
    });

    return (

        <article className="flex justify-between items-center rounded-2xl border bg-white p-4 shadow-sm">

            <div>

                <p className="font-semibold">

                    {

                        movimiento.type === "income"

                            ? "💰 Ingreso"

                            : categoria?.name

                    }

                </p>

                <p className="text-sm text-gray-500">

                    {movimiento.description || "Sin descripción"}

                </p>

                <p className="text-xs text-gray-400 mt-1">

                    {fecha}

                </p>

            </div>

            <div className="flex items-center gap-4">

                <strong className={color}>

                    {signo}

                    {formatCurrency(movimiento.amount)}

                </strong>

                <button

                    onClick={() => eliminarMovimiento(movimiento.id)}

                    className="text-red-500 hover:text-red-700"

                >

                    <Trash2 size={18} />

                </button>

            </div>

        </article>

    );

}