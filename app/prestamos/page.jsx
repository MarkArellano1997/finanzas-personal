"use client";

import { useState } from "react";
import Link from "next/link";

import { formatCurrency } from "@/lib/format/currency";
import { getLoansSummary } from "@/lib/finance/loanBalance";
import useLoanStore from "@/stores/loanStore";

import LoanCard from "@/components/loan/LoanCard";
import LoanSheet from "@/components/loan/LoanSheet";
import LoanPaymentSheet from "@/components/loan/LoanPaymentSheet";

export default function PrestamosPage() {
    const prestamos = useLoanStore((state) => state.prestamos);
    const pagos = useLoanStore((state) => state.pagos);

    const [openLoanSheet, setOpenLoanSheet] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);

    const [openPaymentSheet, setOpenPaymentSheet] = useState(false);
    const [paymentLoanId, setPaymentLoanId] = useState(null);

    const summary = getLoansSummary(prestamos, pagos);

    function handleNewLoan() {
        setSelectedLoan(null);
        setOpenLoanSheet(true);
    }

    function handleEditLoan(loan) {
        setSelectedLoan(loan);
        setOpenLoanSheet(true);
    }

    function handlePayLoan(loanId = null) {
        setPaymentLoanId(loanId);
        setOpenPaymentSheet(true);
    }

    return (
        <main className="min-h-screen bg-slate-100 pb-20">
            <div className="mx-auto min-h-screen max-w-6xl bg-white px-4 py-6 shadow-sm sm:px-6 lg:px-8">
                {/* Encabezado */}
                <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                    <div>
                        <Link
                            href="/"
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            ← Volver al Dashboard
                        </Link>
                        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
                            💰 Mis Préstamos
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Monitorea tus préstamos, saldo pendiente y avance de cuotas
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handlePayLoan()}
                            disabled={prestamos.length === 0}
                            className="rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-40"
                        >
                            💰 Registrar Pago
                        </button>
                        <button
                            type="button"
                            onClick={handleNewLoan}
                            className="rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                        >
                            + Nuevo Préstamo
                        </button>
                    </div>
                </header>

                {/* Tarjetas de Resumen General */}
                <section className="mb-8 grid gap-4 sm:grid-cols-3">
                    <article className="rounded-2xl border bg-slate-900 p-5 text-white shadow-md">
                        <p className="text-xs font-medium text-slate-400">Total Inicial Prestado</p>
                        <p className="mt-2 text-2xl font-extrabold tracking-tight">
                            {formatCurrency(summary.totalMontoInicial)}
                        </p>
                    </article>

                    <article className="rounded-2xl border bg-emerald-600 p-5 text-white shadow-md">
                        <p className="text-xs font-medium opacity-90">Total Amortizado/Pagado</p>
                        <p className="mt-2 text-2xl font-extrabold tracking-tight">
                            {formatCurrency(summary.totalPagado)}
                        </p>
                    </article>

                    <article className="rounded-2xl border bg-rose-500 p-5 text-white shadow-md">
                        <p className="text-xs font-medium opacity-90">Saldo Pendiente Total</p>
                        <p className="mt-2 text-2xl font-extrabold tracking-tight">
                            {formatCurrency(summary.totalSaldoPendiente)}
                        </p>
                    </article>
                </section>

                {/* Listado de Préstamos */}
                {prestamos.length === 0 ? (
                    <div className="my-10 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-3xl">
                            🏦
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">
                            No tienes préstamos registrados
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                            Registra tus préstamos bancarios o personales para llevar un control exacto de cuotas y fechas de vencimiento.
                        </p>
                        <button
                            type="button"
                            onClick={handleNewLoan}
                            className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                        >
                            + Registrar mi primer préstamo
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {prestamos.map((loan) => (
                            <LoanCard
                                key={loan.id}
                                loan={loan}
                                onEdit={handleEditLoan}
                                onPayLoan={handlePayLoan}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Sheets */}
            <LoanSheet
                open={openLoanSheet}
                onOpenChange={setOpenLoanSheet}
                loan={selectedLoan}
            />

            <LoanPaymentSheet
                open={openPaymentSheet}
                onOpenChange={setOpenPaymentSheet}
                defaultLoanId={paymentLoanId}
            />
        </main>
    );
}
