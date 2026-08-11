import { getCardMetrics } from "./cardBalance";
import { getLoanMetrics } from "./loanBalance";

export function getUpcomingPayments({
    tarjetas = [],
    comprasCards = [],
    pagosCards = [],
    prestamos = [],
    pagosLoans = [],
    daysAhead = 30,
    referenceDate = new Date(),
}) {
    const today = new Date(referenceDate);
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const obligations = [];

    // 1. Process Credit Cards Obligations
    tarjetas.forEach((card) => {
        const metrics = getCardMetrics(card, comprasCards, pagosCards);
        if (metrics.deudaActual > 0) {
            const dueDate = metrics.proximaFechaPago;
            const dueZero = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
            const daysDiff = Math.round((dueZero - todayZero) / (1000 * 60 * 60 * 24));

            let status = "proximo";
            if (daysDiff < 0) status = "vencido";
            else if (daysDiff === 0) status = "hoy";

            // Include if within range (from overdue up to daysAhead)
            if (daysDiff >= -30 && daysDiff <= daysAhead) {
                obligations.push({
                    id: `card-${card.id}`,
                    type: "card",
                    title: card.nombre,
                    amount: metrics.deudaActual,
                    dueDate,
                    formattedDate: dueDate.toLocaleDateString("es-PE", {
                        day: "numeric",
                        month: "short",
                    }),
                    daysDiff,
                    status,
                    subtitle: `Deuda actual: S/ ${metrics.deudaActual.toFixed(2)}`,
                    rawCard: card,
                });
            }
        }
    });

    // 2. Process Loans Obligations
    prestamos.forEach((loan) => {
        const metrics = getLoanMetrics(loan, pagosLoans);
        if (!metrics.estaPagadoCompletamente && metrics.saldoPendiente > 0) {
            const dueDate = metrics.proximaFechaPago;
            const dueZero = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
            const daysDiff = Math.round((dueZero - todayZero) / (1000 * 60 * 60 * 24));

            let status = "proximo";
            if (daysDiff < 0) status = "vencido";
            else if (daysDiff === 0) status = "hoy";

            const nextInstallmentNumber = Math.min(
                metrics.cuotasTotales,
                metrics.cuotasPagadas + 1
            );

            if (daysDiff >= -30 && daysDiff <= daysAhead) {
                obligations.push({
                    id: `loan-${loan.id}`,
                    type: "loan",
                    title: loan.descripcion,
                    amount: metrics.proximaCuotaMonto,
                    dueDate,
                    formattedDate: dueDate.toLocaleDateString("es-PE", {
                        day: "numeric",
                        month: "short",
                    }),
                    daysDiff,
                    status,
                    subtitle: `Cuota ${nextInstallmentNumber}/${metrics.cuotasTotales} • Saldo: S/ ${metrics.saldoPendiente.toFixed(2)}`,
                    rawLoan: loan,
                });
            }
        }
    });

    // 3. Sort Chronologically (Earliest date first)
    return obligations.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}
