export function getNextLoanPaymentDate(diaPago, referenceDate = new Date()) {
    const today = new Date(referenceDate);
    const year = today.getFullYear();
    const month = today.getMonth();

    let candidate = new Date(year, month, diaPago);
    const todayZero = new Date(year, month, today.getDate());

    if (candidate < todayZero) {
        candidate = new Date(year, month + 1, diaPago);
    }

    return candidate;
}

export function getLoanMetrics(loan, pagos = []) {
    const pagosPrestamo = pagos.filter((p) => p.loanId === loan.id);

    const montoInicial = Number(loan.montoInicial) || 0;
    const cuotasTotales = Math.max(1, Number(loan.cuotas) || 1);
    const montoCuota = Number(loan.montoCuota) || (montoInicial / cuotasTotales);

    const montoPagado = pagosPrestamo.reduce(
        (sum, p) => sum + (Number(p.monto) || 0),
        0
    );

    const saldoPendiente = Math.max(0, montoInicial - montoPagado);

    // Calculate full or partial paid installments
    const cuotasPagadas = Math.min(
        cuotasTotales,
        Math.floor(montoPagado / (montoCuota || 1))
    );
    const cuotasRestantes = Math.max(0, cuotasTotales - cuotasPagadas);
    const proximaCuotaMonto = saldoPendiente > 0 ? Math.min(montoCuota, saldoPendiente) : 0;
    const proximaFechaPago = getNextLoanPaymentDate(loan.diaPago || 15);
    const estaPagadoCompletamente = saldoPendiente <= 0;

    return {
        loan,
        montoInicial,
        cuotasTotales,
        montoCuota,
        montoPagado,
        saldoPendiente,
        cuotasPagadas,
        cuotasRestantes,
        proximaCuotaMonto,
        proximaFechaPago,
        estaPagadoCompletamente,
        pagos: pagosPrestamo,
    };
}

export function getLoansSummary(prestamos = [], pagos = []) {
    return prestamos.reduce(
        (acc, loan) => {
            const metrics = getLoanMetrics(loan, pagos);
            return {
                totalMontoInicial: acc.totalMontoInicial + metrics.montoInicial,
                totalPagado: acc.totalPagado + metrics.montoPagado,
                totalSaldoPendiente: acc.totalSaldoPendiente + metrics.saldoPendiente,
            };
        },
        { totalMontoInicial: 0, totalPagado: 0, totalSaldoPendiente: 0 }
    );
}
