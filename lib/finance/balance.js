export function getIngresos(movimientos) {
    return movimientos
        .filter((m) => m.type === "income")
        .reduce((total, m) => total + (Number(m.amount) || 0), 0);
}

export function getGastos(movimientos) {
    return movimientos
        .filter((m) => m.type === "expense")
        .reduce((total, m) => total + (Number(m.amount) || 0), 0);
}

export function getDisponible(movimientos) {
    return getIngresos(movimientos) - getGastos(movimientos);
}

export function getSaldoCuenta(cuenta, movimientos) {
    const movimientosCuenta = movimientos.filter(
        (movimiento) => movimiento.accountId === cuenta.id
    );

    return (
        (Number(cuenta.saldoInicial) || 0) +
        getDisponible(movimientosCuenta)
    );
}

export function getBalanceTotal(cuentas, movimientos) {
    const saldosIniciales = cuentas.reduce(
        (total, cuenta) => total + (Number(cuenta.saldoInicial) || 0),
        0
    );

    return saldosIniciales + getDisponible(movimientos);
}
