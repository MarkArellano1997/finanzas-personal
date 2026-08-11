"use client";

import { useState } from "react";
import Link from "next/link";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import {
    getEvolucionMensual,
    getGastosPorCategoria,
    getIngresosDelMes,
    getMovimientosDelMes,
    getResumenMensual,
} from "@/lib/finance/reports";
import { formatCurrency } from "@/lib/format/currency";
import useCategoryStore from "@/stores/categoryStore";
import useFinanceStore from "@/stores/financeStore";

function getCurrentMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
}

export default function ReportsPage() {
    const [selectedDate, setSelectedDate] = useState(getCurrentMonth);
    const movimientos = useFinanceStore((state) => state.movimientos);
    const categorias = useCategoryStore((state) => state.categorias);

    const movimientosDelMes = getMovimientosDelMes(movimientos, selectedDate);
    const resumen = getResumenMensual(movimientos, selectedDate);
    const gastosPorCategoria = getGastosPorCategoria(
        movimientos,
        categorias,
        selectedDate
    );
    const ingresosDelMes = getIngresosDelMes(movimientos, selectedDate);
    const evolucion = getEvolucionMensual(movimientos, selectedDate, 6);

    const maxEvolucion = Math.max(
        ...evolucion.flatMap((item) => [item.ingresos, item.gastos]),
        1
    );

    const monthLabel = selectedDate.toLocaleDateString("es-PE", {
        month: "long",
        year: "numeric",
    });

    function changeMonth(amount) {
        setSelectedDate(
            (currentDate) =>
                new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + amount,
                    1
                )
        );
    }

    function resetToCurrentMonth() {
        setSelectedDate(getCurrentMonth());
    }

    return (
        <main className="min-h-screen bg-slate-100 pb-20">
            <div className="mx-auto min-h-screen max-w-6xl bg-white px-4 py-6 shadow-sm sm:px-6 lg:px-8">
                {/* Header Navigation */}
                <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/"
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                ← Volver al Dashboard
                            </Link>
                        </div>
                        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
                            📊 Reportes Financieros
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Analiza tus ingresos, gastos y evolución mensual
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/movimientos"
                            className="rounded-xl border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            Ver Movimientos
                        </Link>
                    </div>
                </header>

                {/* Selector de Mes */}
                <section className="mb-8 flex items-center justify-between gap-2 rounded-2xl border bg-slate-50 p-3 shadow-sm sm:p-4">
                    <button
                        type="button"
                        aria-label="Mes anterior"
                        onClick={() => changeMonth(-1)}
                        className="flex items-center justify-center rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                        ← <span className="hidden sm:inline ml-1">Anterior</span>
                    </button>

                    <div className="flex flex-col items-center min-w-0">
                        <p className="text-base sm:text-lg font-bold text-slate-800 capitalize truncate">
                            {monthLabel}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={resetToCurrentMonth}
                            className="rounded-xl border bg-white px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                        >
                            Mes actual
                        </button>

                        <button
                            type="button"
                            aria-label="Mes siguiente"
                            onClick={() => changeMonth(1)}
                            className="flex items-center justify-center rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                        >
                            <span className="hidden sm:inline mr-1">Siguiente</span> →
                        </button>
                    </div>
                </section>

                {/* Tarjetas de Resumen Mensual */}
                <section className="grid gap-4 sm:grid-cols-3 mb-8">
                    <article className="rounded-2xl border bg-emerald-500 p-5 text-white shadow-md transition hover:shadow-lg">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium opacity-90">Ingresos del Mes</p>
                            <span className="text-xl">📈</span>
                        </div>
                        <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {formatCurrency(resumen.ingresos)}
                        </p>
                    </article>

                    <article className="rounded-2xl border bg-rose-500 p-5 text-white shadow-md transition hover:shadow-lg">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium opacity-90">Gastos del Mes</p>
                            <span className="text-xl">📉</span>
                        </div>
                        <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {formatCurrency(resumen.gastos)}
                        </p>
                    </article>

                    <article className={`rounded-2xl border p-5 text-white shadow-md transition hover:shadow-lg ${
                        resumen.balance >= 0 ? "bg-blue-600" : "bg-amber-600"
                    }`}>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium opacity-90">Balance del Mes</p>
                            <span className="text-xl">⚖️</span>
                        </div>
                        <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {formatCurrency(resumen.balance)}
                        </p>
                    </article>
                </section>

                {movimientosDelMes.length === 0 ? (
                    <div className="my-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-2xl">
                            📂
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">
                            No hay movimientos en este mes
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Usa la navegación entre meses o registra nuevos ingresos/gastos.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Gastos por Categoría */}
                        <section className="rounded-2xl border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Gastos por Categoría
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Ordenados de mayor a menor consumo
                                    </p>
                                </div>
                                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                                    Total: {formatCurrency(resumen.gastos)}
                                </span>
                            </div>

                            {gastosPorCategoria.length === 0 ? (
                                <p className="py-8 text-center text-sm text-slate-500">
                                    No hay gastos registrados en este mes.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {gastosPorCategoria.map((cat) => (
                                        <div key={cat.id} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="font-semibold text-slate-800 truncate">
                                                        {cat.nombre}
                                                    </span>
                                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-medium">
                                                        {cat.porcentaje.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <strong className="text-slate-900 font-bold shrink-0">
                                                    {formatCurrency(cat.total)}
                                                </strong>
                                            </div>

                                            {/* Barra visual de porcentaje */}
                                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                                    style={{
                                                        width: `${Math.min(cat.porcentaje, 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Detalle de Ingresos del Mes */}
                        <section className="rounded-2xl border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Ingresos del Mes
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Lista de ingresos percibidos
                                    </p>
                                </div>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                                    Total: {formatCurrency(resumen.ingresos)}
                                </span>
                            </div>

                            {ingresosDelMes.length === 0 ? (
                                <p className="py-8 text-center text-sm text-slate-500">
                                    No hay ingresos registrados en este mes.
                                </p>
                            ) : (
                                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                                    {ingresosDelMes.map((ingreso) => (
                                        <div
                                            key={ingreso.id}
                                            className="flex items-center justify-between rounded-xl border bg-slate-50/50 p-3 hover:bg-slate-50 transition"
                                        >
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-800 text-sm truncate">
                                                    {ingreso.description || "Ingreso"}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(ingreso.createdAt).toLocaleDateString("es-PE", {
                                                        day: "numeric",
                                                        month: "short",
                                                    })}
                                                </p>
                                            </div>
                                            <strong className="text-emerald-600 font-bold text-sm shrink-0">
                                                +{formatCurrency(ingreso.amount)}
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {/* Evolución Mensual con Gráficos Recharts */}
                <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Evolución Mensual
                            </h2>
                            <p className="text-xs text-slate-500">
                                Comparativa de Ingresos vs Gastos en los últimos 6 meses
                            </p>
                        </div>
                    </div>

                    {/* Gráfico Recharts */}
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={evolucion}
                                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="label" stroke="#64748b" fontSize={12} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(val) => `S/ ${val}`} />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "0.75rem",
                                        borderColor: "#e2e8f0",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                />
                                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                                <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="gastos" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Barras de fallback/resumen en lista */}
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {evolucion.map((item) => (
                            <div key={item.label} className="rounded-xl border bg-slate-50 p-3">
                                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2 capitalize">
                                    <span>{item.fullLabel || item.label}</span>
                                    <span className={item.balance >= 0 ? "text-emerald-600" : "text-rose-600"}>
                                        Balance: {formatCurrency(item.balance)}
                                    </span>
                                </div>
                                <div className="space-y-1.5 text-xs">
                                    <div>
                                        <div className="flex justify-between text-slate-500 mb-0.5">
                                            <span>Ingresos</span>
                                            <span>{formatCurrency(item.ingresos)}</span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className="h-full rounded-full bg-emerald-500"
                                                style={{ width: `${(item.ingresos / maxEvolucion) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-slate-500 mb-0.5">
                                            <span>Gastos</span>
                                            <span>{formatCurrency(item.gastos)}</span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className="h-full rounded-full bg-rose-500"
                                                style={{ width: `${(item.gastos / maxEvolucion) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

