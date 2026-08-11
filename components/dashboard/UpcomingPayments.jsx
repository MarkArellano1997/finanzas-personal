"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/format/currency";
import { getUpcomingPayments } from "@/lib/finance/upcomingPayments";
import useCardStore from "@/stores/cardStore";
import useLoanStore from "@/stores/loanStore";

export default function UpcomingPayments({ maxItems = null }) {
    const tarjetas = useCardStore((state) => state.tarjetas);
    const comprasCards = useCardStore((state) => state.compras);
    const pagosCards = useCardStore((state) => state.pagos);

    const prestamos = useLoanStore((state) => state.prestamos);
    const pagosLoans = useLoanStore((state) => state.pagos);

    const obligations = getUpcomingPayments({
        tarjetas,
        comprasCards,
        pagosCards,
        prestamos,
        pagosLoans,
        daysAhead: 30,
    });

    const displayedObligations = maxItems ? obligations.slice(0, maxItems) : obligations;

    return (
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span>📅 Próximos Pagos</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                        Obligaciones de tarjetas y cuotas de préstamos
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/tarjetas"
                        className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                        Tarjetas
                    </Link>
                    <span className="text-slate-300">•</span>
                    <Link
                        href="/prestamos"
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                        Préstamos
                    </Link>
                </div>
            </div>

            {displayedObligations.length === 0 ? (
                <div className="py-8 text-center border border-dashed rounded-xl bg-slate-50">
                    <p className="text-2xl mb-1">🎉</p>
                    <p className="text-sm font-semibold text-slate-700">
                        No tienes próximos pagos.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        No hay vencimientos de tarjetas ni cuotas pendientes para los próximos 30 días.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {displayedObligations.map((item) => {
                        let statusBadgeClass = "bg-slate-100 text-slate-700 border-slate-200";
                        let statusText = `En ${item.daysDiff} días`;

                        if (item.status === "vencido") {
                            statusBadgeClass = "bg-rose-100 text-rose-800 border-rose-200 font-bold";
                            statusText = `Vencido (${Math.abs(item.daysDiff)} d)`;
                        } else if (item.status === "hoy") {
                            statusBadgeClass = "bg-amber-100 text-amber-900 border-amber-300 font-extrabold animate-pulse";
                            statusText = "¡Vence Hoy!";
                        } else if (item.daysDiff === 1) {
                            statusText = "Mañana";
                        }

                        const targetHref = item.type === "card" ? "/tarjetas" : "/prestamos";

                        return (
                            <Link
                                key={item.id}
                                href={targetHref}
                                className="flex items-center justify-between gap-3 rounded-xl border p-3 bg-slate-50/50 hover:bg-slate-50 transition group"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border shadow-xs text-xl">
                                        {item.type === "card" ? "💳" : "💰"}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition">
                                                {item.title}
                                            </p>
                                            <span className={`rounded-md border px-2 py-0.5 text-[10px] ${statusBadgeClass}`}>
                                                {statusText}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate mt-0.5">
                                            {item.subtitle}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <span className="block text-xs font-semibold text-slate-500 capitalize">
                                        {item.formattedDate}
                                    </span>
                                    <strong className="block text-sm font-extrabold text-slate-900">
                                        {formatCurrency(item.amount)}
                                    </strong>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
