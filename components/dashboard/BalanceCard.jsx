"use client";

import useFinanceStore from "@/stores/financeStore";
import { Wallet } from "lucide-react";

import {
    getDisponible,
} from "@/lib/finance/balance";

import {
    formatCurrency,
} from "@/lib/format/currency";

export default function BalanceCard() {
    const movimientos = useFinanceStore(
        (state) => state.movimientos
    );

    const disponible = getDisponible(movimientos);

    return (
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-blue-100">
                        Disponible
                    </p>

                    <h2 className="mt-2 text-4xl font-bold">

                        {formatCurrency(disponible)}

                    </h2>

                </div>

                <div className="rounded-full bg-white/20 p-4">

                    <Wallet size={30} />

                </div>

            </div>

        </section>
    );
}