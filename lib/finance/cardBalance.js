export function getNextPaymentDate(diaPago, referenceDate = new Date()) {
    const today = new Date(referenceDate);
    const year = today.getFullYear();
    const month = today.getMonth();

    // Check if payment day in current month has passed or is today
    let candidate = new Date(year, month, diaPago);

    // Normalize time to compare dates cleanly
    const todayZero = new Date(year, month, today.getDate());

    if (candidate < todayZero) {
        candidate = new Date(year, month + 1, diaPago);
    }

    return candidate;
}

export function getNextClosingDate(diaCierre, referenceDate = new Date()) {
    const today = new Date(referenceDate);
    const year = today.getFullYear();
    const month = today.getMonth();

    let candidate = new Date(year, month, diaCierre);
    const todayZero = new Date(year, month, today.getDate());

    if (candidate < todayZero) {
        candidate = new Date(year, month + 1, diaCierre);
    }

    return candidate;
}

export function getPurchaseInstallmentMetrics(compra, totalPagosTarjeta = 0) {
    const montoTotal = Number(compra.monto) || 0;
    const cuotasTotales = Math.max(1, Number(compra.cuotas) || 1);
    const montoCuota = Number(compra.montoCuota) || (montoTotal / cuotasTotales);

    // If purchase explicitly tracks cuotasPagadas, use it, or estimate from card payments
    const montoPagadoAsignado = Math.min(
        montoTotal,
        (compra.cuotasPagadas || 0) * montoCuota
    );

    const montoPagado = Math.min(montoTotal, Math.max(0, montoPagadoAsignado));
    const cuotasPagadas = Math.min(
        cuotasTotales,
        compra.cuotasPagadas !== undefined
            ? compra.cuotasPagadas
            : Math.floor(montoPagado / (montoCuota || 1))
    );
    const cuotasRestantes = Math.max(0, cuotasTotales - cuotasPagadas);
    const montoPendiente = Math.max(0, montoTotal - montoPagado);

    return {
        montoTotal,
        cuotasTotales,
        montoCuota,
        montoPagado,
        cuotasPagadas,
        cuotasRestantes,
        montoPendiente,
    };
}

export function getCardMetrics(card, compras = [], pagos = []) {
    const comprasTarjeta = compras.filter((c) => c.cardId === card.id);
    const pagosTarjeta = pagos.filter((p) => p.cardId === card.id);

    const totalCompras = comprasTarjeta.reduce(
        (sum, c) => sum + (Number(c.monto) || 0),
        0
    );

    const totalPagos = pagosTarjeta.reduce(
        (sum, p) => sum + (Number(p.monto) || 0),
        0
    );

    const deudaActual = Math.max(0, totalCompras - totalPagos);
    const limiteCredito = Number(card.limiteCredito) || 0;
    const creditoDisponible = Math.max(0, limiteCredito - deudaActual);
    const proximaFechaPago = getNextPaymentDate(card.diaPago);
    const proximaFechaCierre = getNextClosingDate(card.diaCierre);

    return {
        card,
        totalCompras,
        totalPagos,
        deudaActual,
        limiteCredito,
        creditoDisponible,
        proximaFechaPago,
        proximaFechaCierre,
        compras: comprasTarjeta,
        pagos: pagosTarjeta,
    };
}

export function getCardsSummary(tarjetas = [], compras = [], pagos = []) {
    return tarjetas.reduce(
        (acc, card) => {
            const metrics = getCardMetrics(card, compras, pagos);
            return {
                totalLimite: acc.totalLimite + metrics.limiteCredito,
                totalDeuda: acc.totalDeuda + metrics.deudaActual,
                totalDisponible: acc.totalDisponible + metrics.creditoDisponible,
            };
        },
        { totalLimite: 0, totalDeuda: 0, totalDisponible: 0 }
    );
}
