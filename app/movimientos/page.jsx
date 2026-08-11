"use client";

import { useState } from "react";
import Link from "next/link";

import { formatCurrency } from "@/lib/format/currency";
import { getGastos, getIngresos } from "@/lib/finance/balance";
import useFinanceStore from "@/stores/financeStore";
import useAccountStore from "@/stores/accountStore";
import useCategoryStore from "@/stores/categoryStore";

import RegisterMovementSheet from "@/components/movement/RegisterMovementSheet";

export default function MovimientosPage() {
    const movimientos = useFinanceStore((state) => state.movimientos);
    const eliminarMovimiento = useFinanceStore((state) => state.eliminarMovimiento);

    const cuentas = useAccountStore((state) => state.cuentas);
    const categorias = useCategoryStore((state) => state.categorias);

    const [openSheet, setOpenSheet] = useState(false);
    const [filterType, setFilterType] = useState("all");
    const [filterAccount, setFilterAccount] = useState("all");
    const [filterCategory, setFilterCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const accountMap = new Map(cuentas.map((a) => [a.id, a.nombre]));
    const categoryMap = new Map(categorias.map((c) => [c.id, c.nombre || c.name]));

    const filteredMovimientos = movimientos.filter((m) => {
        if (filterType !== "all" && m.type !== filterType) return false;
        if (filterAccount !== "all" && m.accountId !== filterAccount) return false;
        if (filterCategory !== "all" && m.categoryId !== filterCategory) return false;
        if (
            searchTerm.trim() !== "" &&
            !m.description?.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
            return false;
        }
        return true;
    });

    const totalIngresos = getIngresos(filteredMovimientos);
    const totalGastos = getGastos(filteredMovimientos);

    return (
        <main className="min-h-screen bg-slate-100 pb-24">
            <div className="mx-auto min-h-screen max-w-6xl bg-white px-4 py-6 shadow-sm sm:px-6 lg:px-8">
                {/* Header */}
                <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                    <div>
                        <Link
                            href="/"
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            ← Volver al Dashboard
                        </Link>
                        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
                            💸 Historial de Movimientos
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Consulta, filtra y gestiona todos tus ingresos y gastos
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setOpenSheet(true)}
                        className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                        + Nuevo Movimiento
                    </button>
                </header>

                {/* Tarjetas de Resumen */}
                <section className="mb-6 grid gap-4 sm:grid-cols-3">
                    <article className="rounded-2xl border bg-emerald-50 p-4 text-emerald-950">
                        <p className="text-xs font-semibold text-emerald-700">Total Ingresos Filtrados</p>
                        <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                            +{formatCurrency(totalIngresos)}
                        </p>
                    </article>

                    <article className="rounded-2xl border bg-rose-50 p-4 text-rose-950">
                        <p className="text-xs font-semibold text-rose-700">Total Gastos Filtrados</p>
                        <p className="mt-1 text-2xl font-extrabold text-rose-600">
                            -{formatCurrency(totalGastos)}
                        </p>
                    </article>

                    <article className="rounded-2xl border bg-blue-50 p-4 text-blue-950">
                        <p className="text-xs font-semibold text-blue-700">Neto del Período</p>
                        <p className="mt-1 text-2xl font-extrabold text-blue-600">
                            {formatCurrency(totalIngresos - totalGastos)}
                        </p>
                    </article>
                </section>

                {/* Filtros */}
                <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border bg-slate-50 p-4">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                            Buscar descripción
                        </label>
                        <input
                            type="text"
                            placeholder="Ej. Almuerzo, Sueldo"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                            Tipo de Movimiento
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full rounded-xl border p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos los tipos</option>
                            <option value="income">📈 Ingresos</option>
                            <option value="expense">📉 Gastos</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                            Cuenta
                        </label>
                        <select
                            value={filterAccount}
                            onChange={(e) => setFilterAccount(e.target.value)}
                            className="w-full rounded-xl border p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todas las cuentas</option>
                            {cuentas.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                            Categoría
                        </label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full rounded-xl border p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todas las categorías</option>
                            {categorias.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nombre || c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Lista de Movimientos */}
                {filteredMovimientos.length === 0 ? (
                    <div className="my-10 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-2xl">
                            🔍
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">
                            No hay movimientos registrados
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                            {movimientos.length === 0
                                ? "Comienza registrando tu primer ingreso o gasto con el botón superior."
                                : "No se encontraron resultados para los filtros seleccionados."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredMovimientos.map((m) => {
                            const isExpense = m.type === "expense";
                            const accountName = accountMap.get(m.accountId) || "Sin cuenta";
                            const categoryName = isExpense
                                ? categoryMap.get(m.categoryId) || "General"
                                : "Ingreso";

                            return (
                                <article
                                    key={m.id}
                                    className="flex items-center justify-between gap-4 rounded-2xl border bg-white p-4 shadow-2xs hover:shadow-xs transition"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${
                                                isExpense
                                                    ? "bg-rose-100 text-rose-600"
                                                    : "bg-emerald-100 text-emerald-600"
                                            }`}
                                        >
                                            {isExpense ? "📉" : "📈"}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-900 truncate">
                                                {m.description || (isExpense ? "Gasto" : "Ingreso")}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                                                    🏦 {accountName}
                                                </span>
                                                {isExpense && (
                                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                                                        🏷️ {categoryName}
                                                    </span>
                                                )}
                                                <span>
                                                    {new Date(m.createdAt).toLocaleDateString("es-PE", {
                                                        day: "numeric",
                                                        month: "short",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0">
                                        <strong
                                            className={`text-base sm:text-lg font-extrabold ${
                                                isExpense ? "text-rose-600" : "text-emerald-600"
                                            }`}
                                        >
                                            {isExpense ? "-" : "+"}
                                            {formatCurrency(m.amount)}
                                        </strong>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (confirm("¿Eliminar este movimiento?")) {
                                                    eliminarMovimiento(m.id);
                                                }
                                            }}
                                            className="text-slate-400 hover:text-red-600 transition text-sm"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            <RegisterMovementSheet open={openSheet} onOpenChange={setOpenSheet} />
        </main>
    );
}
