"use client";

import {
    ArrowDownCircle,
    ArrowUpCircle,
} from "lucide-react";

import useFinanceStore from "@/stores/financeStore";

import {
    getIngresos,
    getGastos,
} from "@/lib/finance/balance";

import {
    formatCurrency,
} from "@/lib/format/currency";

export default function SummaryCards() {
    const movimientos = useFinanceStore(
        (state) => state.movimientos
    );

    return (
        <section className="grid grid-cols-2 gap-4">

            <article className="rounded-3xl bg-green-500 p-5 text-white shadow">

                <div className="flex items-center justify-between">

                    <p>Ingresos</p>

                    <ArrowUpCircle />

                </div>

                <h2 className="mt-4 text-2xl font-bold">

                    {formatCurrency(
                        getIngresos(movimientos)
                    )}

                </h2>

            </article>

            <article className="rounded-3xl bg-red-500 p-5 text-white shadow">

                <div className="flex items-center justify-between">

                    <p>Gastos</p>

                    <ArrowDownCircle />

                </div>

                <h2 className="mt-4 text-2xl font-bold">

                    {formatCurrency(
                        getGastos(movimientos)
                    )}

                </h2>

            </article>

        </section>
    );
}