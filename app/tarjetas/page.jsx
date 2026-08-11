"use client";

import { useState } from "react";
import Link from "next/link";

import { formatCurrency } from "@/lib/format/currency";
import { getCardsSummary } from "@/lib/finance/cardBalance";
import useCardStore from "@/stores/cardStore";

import CardCard from "@/components/card/CardCard";
import CardSheet from "@/components/card/CardSheet";
import PurchaseSheet from "@/components/card/PurchaseSheet";
import PaymentSheet from "@/components/card/PaymentSheet";

export default function TarjetasPage() {
    const tarjetas = useCardStore((state) => state.tarjetas);
    const compras = useCardStore((state) => state.compras);
    const pagos = useCardStore((state) => state.pagos);

    const [openCardSheet, setOpenCardSheet] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const [openPurchaseSheet, setOpenPurchaseSheet] = useState(false);
    const [purchaseCardId, setPurchaseCardId] = useState(null);

    const [openPaymentSheet, setOpenPaymentSheet] = useState(false);
    const [paymentCardId, setPaymentCardId] = useState(null);

    const summary = getCardsSummary(tarjetas, compras, pagos);

    function handleNewCard() {
        setSelectedCard(null);
        setOpenCardSheet(true);
    }

    function handleEditCard(card) {
        setSelectedCard(card);
        setOpenCardSheet(true);
    }

    function handleAddPurchase(cardId = null) {
        setPurchaseCardId(cardId);
        setOpenPurchaseSheet(true);
    }

    function handlePayCard(cardId = null) {
        setPaymentCardId(cardId);
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
                            💳 Tarjetas de Crédito
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Administra tus líneas de crédito, compras en cuotas y fechas de pago
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleAddPurchase()}
                            disabled={tarjetas.length === 0}
                            className="rounded-xl bg-purple-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-40"
                        >
                            🛍️ + Compra
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePayCard()}
                            disabled={tarjetas.length === 0}
                            className="rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-40"
                        >
                            💳 Registrar Pago
                        </button>
                        <button
                            type="button"
                            onClick={handleNewCard}
                            className="rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                        >
                            + Tarjeta
                        </button>
                    </div>
                </header>

                {/* Tarjetas de Resumen General */}
                <section className="mb-8 grid gap-4 sm:grid-cols-3">
                    <article className="rounded-2xl border bg-slate-900 p-5 text-white shadow-md">
                        <p className="text-xs font-medium text-slate-400">Total Límites de Crédito</p>
                        <p className="mt-2 text-2xl font-extrabold tracking-tight">
                            {formatCurrency(summary.totalLimite)}
                        </p>
                    </article>

                    <article className="rounded-2xl border bg-rose-500 p-5 text-white shadow-md">
                        <p className="text-xs font-medium opacity-90">Deuda Total Consumida</p>
                        <p className="mt-2 text-2xl font-extrabold tracking-tight">
                            {formatCurrency(summary.totalDeuda)}
                        </p>
                    </article>

                    <article className="rounded-2xl border bg-emerald-600 p-5 text-white shadow-md">
                        <p className="text-xs font-medium opacity-90">Crédito Total Disponible</p>
                        <p className="mt-2 text-2xl font-extrabold tracking-tight">
                            {formatCurrency(summary.totalDisponible)}
                        </p>
                    </article>
                </section>

                {/* Listado de Tarjetas de Crédito */}
                {tarjetas.length === 0 ? (
                    <div className="my-10 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-3xl">
                            💳
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">
                            No tienes tarjetas registradas
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                            Registra tu primera tarjeta de crédito para gestionar tus límites, tus consumos en cuotas y evitar recargos por mora.
                        </p>
                        <button
                            type="button"
                            onClick={handleNewCard}
                            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                        >
                            + Registrar mi primera tarjeta
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {tarjetas.map((card) => (
                            <CardCard
                                key={card.id}
                                card={card}
                                onEdit={handleEditCard}
                                onAddPurchase={handleAddPurchase}
                                onPayCard={handlePayCard}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Sheets */}
            <CardSheet
                open={openCardSheet}
                onOpenChange={setOpenCardSheet}
                card={selectedCard}
            />

            <PurchaseSheet
                open={openPurchaseSheet}
                onOpenChange={setOpenPurchaseSheet}
                defaultCardId={purchaseCardId}
            />

            <PaymentSheet
                open={openPaymentSheet}
                onOpenChange={setOpenPaymentSheet}
                defaultCardId={paymentCardId}
            />
        </main>
    );
}
