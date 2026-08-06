export function getIngresos(movimientos) {
    return movimientos
        .filter((m) => m.type === "income")
        .reduce((total, m) => total + m.amount, 0);
}

export function getGastos(movimientos) {
    return movimientos
        .filter((m) => m.type === "expense")
        .reduce((total, m) => total + m.amount, 0);
}

export function getDisponible(movimientos) {
    return getIngresos(movimientos) - getGastos(movimientos);
}