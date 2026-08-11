"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format/currency";
import { getCardMetrics, getPurchaseInstallmentMetrics } from "@/lib/finance/cardBalance";
import useCardStore from "@/stores/cardStore";
import useCategoryStore from "@/stores/categoryStore";

export default function CardCard({
    card,
    onEdit,
    onAddPurchase,
    onPayCard,
}) {
    const [showHistory, setShowHistory] = useState(false);
    const compras = useCardStore((state) => state.compras);
    const pagos = useCardStore((state) => state.pagos);
    const eliminarCompra = useCardStore((state) => state.eliminarCompra);
    const categorias = useCategoryStore((state) => state.categorias);

    const metrics = getCardMetrics(card, compras, pagos);
    const totalComprasCount = metrics.compras.length;

    const fechaPagoFormateada = metrics.proximaFechaPago.toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const categoryMap = new Map(categorias.map((c) => [c.id, c.nombre || c.name]));

    return (
        <article className="rounded-2xl border bg-white shadow-sm overflow-hidden transition hover:shadow-md">
            {/* Encabezado Visual de Tarjeta */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 p-5 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">💳</span>
                        <h3 className="text-lg font-bold tracking-wide">{card.nombre}</h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => onEdit(card)}
                        className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/20 transition"
                    >
                        ⚙️ Editar
                    </button>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs opacity-75">Deuda Actual</p>
                        <p className="mt-0.5 text-2xl font-extrabold text-rose-300">
                            {formatCurrency(metrics.deudaActual)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs opacity-75">Crédito Disponible</p>
                        <p className="mt-0.5 text-2xl font-extrabold text-emerald-300">
                            {formatCurrency(metrics.creditoDisponible)}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs opacity-90">
                    <div>
                        <span>Límite total: </span>
                        <strong>{formatCurrency(metrics.limiteCredito)}</strong>
                    </div>
                    <div>
                        <span>Próximo pago: </span>
                        <strong className="text-amber-300">{fechaPagoFormateada}</strong>
                    </div>
                </div>
            </div>

            {/* Sub-Header con detalles y botones de acción */}
            <div className="p-4 bg-slate-50 border-b flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                    <span>🗓️ Cierre: <strong>Día {card.diaCierre}</strong></span>
                    <span>💳 Pago: <strong>Día {card.diaPago}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onAddPurchase(card.id)}
                        className="rounded-xl bg-purple-600 px-3 py-1.5 font-semibold text-white hover:bg-purple-700 transition"
                    >
                        🛍️ + Compra
                    </button>
                    <button
                        type="button"
                        onClick={() => onPayCard(card.id)}
                        className="rounded-xl bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700 transition"
                    >
                        💰 Pagar
                    </button>
                </div>
            </div>

            {/* Sección de Compras y Cuotas */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setShowHistory(!showHistory)}
                        className="flex items-center gap-1.5 text-sm font-bold text-slate-800 hover:text-blue-600 transition"
                    >
                        <span>Compras asociadas ({totalComprasCount})</span>
                        <span className="text-xs text-slate-400">
                            {showHistory ? "▲ Ocultar" : "▼ Mostrar desgloses"}
                        </span>
                    </button>

                    {metrics.deudaActual > 0 && (
                        <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                            Deuda activa
                        </span>
                    )}
                </div>

                {showHistory && (
                    <div className="mt-4 space-y-3">
                        {metrics.compras.length === 0 ? (
                            <p className="py-3 text-center text-xs text-slate-400">
                                No se han registrado compras con esta tarjeta.
                            </p>
                        ) : (
                            metrics.compras.map((compra) => {
                                const inst = getPurchaseInstallmentMetrics(compra, metrics.totalPagos);
                                const categoryName = categoryMap.get(compra.categoryId) || "General";

                                return (
                                    <div
                                        key={compra.id}
                                        className="rounded-xl border bg-slate-50/70 p-3 text-xs space-y-2"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">
                                                    {compra.descripcion}
                                                </p>
                                                <p className="text-slate-500">
                                                    {new Date(compra.fecha).toLocaleDateString("es-PE")} • {categoryName}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-extrabold text-slate-900 text-sm">
                                                    {formatCurrency(inst.montoTotal)}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm("¿Eliminar esta compra?")) {
                                                            eliminarCompra(compra.id);
                                                        }
                                                    }}
                                                    className="text-red-500 hover:underline mt-0.5"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>

                                        {/* Detalle de Cuotas */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg bg-white p-2 border text-slate-700">
                                            <div>
                                                <span className="block text-[10px] text-slate-400">Cuotas totales</span>
                                                <strong className="font-semibold">{inst.cuotasTotales}</strong>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-slate-400">Monto cuota</span>
                                                <strong className="font-semibold">{formatCurrency(inst.montoCuota)}</strong>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-slate-400">Cuotas pagadas</span>
                                                <strong className="font-semibold text-emerald-600">
                                                    {inst.cuotasPagadas} de {inst.cuotasTotales}
                                                </strong>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-slate-400">Pendiente</span>
                                                <strong className="font-semibold text-rose-600">
                                                    {formatCurrency(inst.montoPendiente)}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}
