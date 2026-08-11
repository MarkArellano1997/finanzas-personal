"use client";

import { Trash2 } from "lucide-react";

import { formatCurrency } from "@/lib/format/currency";
import useAccountStore from "@/stores/accountStore";
import useCategoryStore from "@/stores/categoryStore";
import useFinanceStore from "@/stores/financeStore";

export default function MovementItem({ movimiento }) {
    const eliminarMovimiento = useFinanceStore(
        (state) => state.eliminarMovimiento
    );
    const cuentas = useAccountStore((state) => state.cuentas);
    const categorias = useCategoryStore((state) => state.categorias);

    const categoria = categorias.find(
        (item) => item.id === movimiento.categoryId
    );
    const cuenta = cuentas.find((item) => item.id === movimiento.accountId);
    const isIncome = movimiento.type === "income";
    const fecha = new Date(movimiento.createdAt).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
    });

    return (
        <article className="flex items-center justify-between gap-4 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="min-w-0">
                <p className="truncate font-semibold">
                    {movimiento.description || (isIncome ? "Ingreso" : "Gasto")}
                </p>

                <p className="truncate text-sm text-gray-500">
                    {isIncome
                        ? "Ingreso"
                        : categoria?.nombre || categoria?.name || "Sin categoría"}
                    {cuenta ? ` · ${cuenta.nombre}` : ""}
                </p>

                <p className="mt-1 text-xs text-gray-400">{fecha}</p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
                <strong className={isIncome ? "text-green-600" : "text-red-600"}>
                    {isIncome ? "+" : "-"}
                    {formatCurrency(movimiento.amount)}
                </strong>

                <button
                    type="button"
                    aria-label="Eliminar movimiento"
                    onClick={() => eliminarMovimiento(movimiento.id)}
                    className="text-red-500 hover:text-red-700"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </article>
    );
}
