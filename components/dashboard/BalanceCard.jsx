"use client";

import useFinanceStore from "@/stores/financeStore";
import useAccountStore from "@/stores/accountStore";
import { Wallet } from "lucide-react";

import {
    getBalanceTotal,
} from "@/lib/finance/balance";

import {
    formatCurrency,
} from "@/lib/format/currency";

export default function BalanceCard() {
    const movimientos = useFinanceStore(
        (state) => state.movimientos
    );
    const cuentas = useAccountStore((state) => state.cuentas);

    const balanceTotal = getBalanceTotal(cuentas, movimientos);

    return (
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-blue-100">
                        Balance total
                    </p>

                    <h2 className="mt-2 text-4xl font-bold">

                        {formatCurrency(balanceTotal)}

                    </h2>

                </div>

                <div className="rounded-full bg-white/20 p-4">

                    <Wallet size={30} />

                </div>

            </div>

        </section>
    );
}
