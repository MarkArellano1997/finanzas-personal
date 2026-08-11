export function createCard({
    nombre,
    limiteCredito,
    diaCierre,
    diaPago,
}) {
    const now = new Date().toISOString();

    return {
        id: crypto.randomUUID(),
        nombre: nombre.trim(),
        limiteCredito: Number(limiteCredito) || 0,
        diaCierre: Number(diaCierre) || 1,
        diaPago: Number(diaPago) || 1,
        createdAt: now,
        updatedAt: now,
    };
}

export function createCardPurchase({
    cardId,
    descripcion,
    monto,
    cuotas = 1,
    categoryId = null,
    fecha = new Date().toISOString(),
}) {
    const now = new Date().toISOString();
    const totalMonto = Number(monto) || 0;
    const numCuotas = Math.max(1, Number(cuotas) || 1);
    const montoCuota = totalMonto / numCuotas;

    return {
        id: crypto.randomUUID(),
        cardId,
        descripcion: descripcion.trim(),
        monto: totalMonto,
        cuotas: numCuotas,
        montoCuota: Number(montoCuota.toFixed(2)),
        categoryId: categoryId || null,
        fecha,
        createdAt: now,
        updatedAt: now,
    };
}

export function createCardPayment({
    cardId,
    monto,
    accountId = null,
    descripcion = "Pago de tarjeta",
    fecha = new Date().toISOString(),
}) {
    const now = new Date().toISOString();

    return {
        id: crypto.randomUUID(),
        cardId,
        monto: Number(monto) || 0,
        accountId: accountId || null,
        descripcion: descripcion.trim(),
        fecha,
        createdAt: now,
    };
}
