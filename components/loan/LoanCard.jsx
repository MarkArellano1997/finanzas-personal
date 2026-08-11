"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format/currency";
import { getLoanMetrics } from "@/lib/finance/loanBalance";
import useLoanStore from "@/stores/loanStore";

export default function LoanCard({
    loan,
    onEdit,
    onPayLoan,
}) {
    const [showHistory, setShowHistory] = useState(false);
    const pagos = useLoanStore((state) => state.pagos);
    const eliminarPagoPrestamo = useLoanStore((state) => state.eliminarPagoPrestamo);

    const metrics = getLoanMetrics(loan, pagos);

    const fechaPagoFormateada = metrics.proximaFechaPago.toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const porcentajePagado = metrics.montoInicial > 0
        ? Math.min(100, (metrics.montoPagado / metrics.montoInicial) * 100)
        : 0;

    return (
        <article className="rounded-2xl border bg-white shadow-sm overflow-hidden transition hover:shadow-md">
            {/* Encabezado Visual de Préstamo */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🏦</span>
                        <h3 className="text-lg font-bold tracking-wide">{loan.descripcion}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {metrics.estaPagadoCompletamente ? (
                            <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 text-xs font-bold">
                                ✓ Pagado
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onEdit(loan)}
                                className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/20 transition"
                            >
                                ⚙️ Editar
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs opacity-75">Saldo Pendiente</p>
                        <p className="mt-0.5 text-2xl font-extrabold text-rose-300">
                            {formatCurrency(metrics.saldoPendiente)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs opacity-75">Monto Pagado</p>
                        <p className="mt-0.5 text-2xl font-extrabold text-emerald-300">
                            {formatCurrency(metrics.montoPagado)}
                        </p>
                    </div>
                </div>

                {/* Barra de progreso de amortización */}
                <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[11px] opacity-80">
                        <span>Progreso de pago: {porcentajePagado.toFixed(1)}%</span>
                        <span>Inicial: {formatCurrency(metrics.montoInicial)}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                        <div
                            className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                            style={{ width: `${porcentajePagado}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Sub-Header con detalles y botones de acción */}
            <div className="p-4 bg-slate-50 border-b flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
                <div className="space-y-0.5">
                    <p>
                        Cuotas: <strong className="text-slate-900">{metrics.cuotasPagadas} de {metrics.cuotasTotales} pagadas</strong> ({metrics.cuotasRestantes} restantes)
                    </p>
                    {!metrics.estaPagadoCompletamente && (
                        <p className="text-slate-500">
                            Próxima cuota: <strong className="text-slate-900">{formatCurrency(metrics.proximaCuotaMonto)}</strong> el <strong className="text-indigo-600">{fechaPagoFormateada}</strong>
                        </p>
                    )}
                </div>

                {!metrics.estaPagadoCompletamente && (
                    <button
                        type="button"
                        onClick={() => onPayLoan(loan.id)}
                        className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
                    >
                        💰 Registrar Pago
                    </button>
                )}
            </div>

            {/* Sección de Historial de Pagos */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setShowHistory(!showHistory)}
                        className="flex items-center gap-1.5 text-sm font-bold text-slate-800 hover:text-blue-600 transition"
                    >
                        <span>Historial de pagos ({metrics.pagos.length})</span>
                        <span className="text-xs text-slate-400">
                            {showHistory ? "▲ Ocultar" : "▼ Mostrar pagos"}
                        </span>
                    </button>
                </div>

                {showHistory && (
                    <div className="mt-3 space-y-2">
                        {metrics.pagos.length === 0 ? (
                            <p className="py-3 text-center text-xs text-slate-400">
                                No se han registrado pagos para este préstamo.
                            </p>
                        ) : (
                            metrics.pagos.map((pago) => (
                                <div
                                    key={pago.id}
                                    className="flex items-center justify-between rounded-xl border bg-slate-50/70 p-3 text-xs"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {pago.descripcion || "Pago de cuota"}
                                        </p>
                                        <p className="text-slate-500">
                                            {new Date(pago.fecha).toLocaleDateString("es-PE")}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <strong className="text-emerald-600 text-sm font-bold">
                                            +{formatCurrency(pago.monto)}
                                        </strong>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (confirm("¿Eliminar este pago?")) {
                                                    eliminarPagoPrestamo(pago.id);
                                                }
                                            }}
                                            className="text-red-500 hover:underline text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}
