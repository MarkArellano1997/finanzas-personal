export function createLoan({
    descripcion,
    montoInicial,
    cuotas,
    montoCuota,
    fechaInicio = new Date().toISOString(),
    diaPago,
}) {
    const now = new Date().toISOString();
    const initialAmount = Number(montoInicial) || 0;
    const totalCuotas = Math.max(1, Number(cuotas) || 1);
    const installmentAmount = Number(montoCuota) || (initialAmount / totalCuotas);

    return {
        id: crypto.randomUUID(),
        descripcion: descripcion.trim(),
        montoInicial: initialAmount,
        cuotas: totalCuotas,
        montoCuota: Number(installmentAmount.toFixed(2)),
        fechaInicio,
        diaPago: Number(diaPago) || 15,
        createdAt: now,
        updatedAt: now,
    };
}

export function createLoanPayment({
    loanId,
    monto,
    accountId = null,
    descripcion = "Pago de cuota de préstamo",
    fecha = new Date().toISOString(),
}) {
    const now = new Date().toISOString();

    return {
        id: crypto.randomUUID(),
        loanId,
        monto: Number(monto) || 0,
        accountId: accountId || null,
        descripcion: descripcion.trim(),
        fecha,
        createdAt: now,
    };
}
