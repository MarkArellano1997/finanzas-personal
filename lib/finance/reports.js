import { getGastos, getIngresos } from "./balance";

function getDate(value) {
    if (!value) return new Date();
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d.getTime()) ? new Date() : d;
}

function isSameMonth(date, referenceDate) {
    const currentDate = getDate(date);
    const refDate = getDate(referenceDate);

    return (
        currentDate.getFullYear() === refDate.getFullYear() &&
        currentDate.getMonth() === refDate.getMonth()
    );
}

export function getMovimientosDelMes(movimientos = [], selectedDate) {
    const refDate = getDate(selectedDate);
    return movimientos.filter((movimiento) =>
        isSameMonth(movimiento.createdAt, refDate)
    );
}

export function getResumenMensual(movimientos = [], selectedDate) {
    const movimientosDelMes = getMovimientosDelMes(movimientos, selectedDate);
    const ingresos = getIngresos(movimientosDelMes);
    const gastos = getGastos(movimientosDelMes);

    return {
        ingresos,
        gastos,
        balance: ingresos - gastos,
    };
}

export function getGastosPorCategoria(
    movimientos = [],
    categorias = [],
    selectedDate
) {
    const nombresCategorias = new Map(
        categorias.map((categoria) => [
            categoria.id,
            categoria.nombre || categoria.name,
        ])
    );
    const gastosMap = new Map();
    const movimientosDelMes = getMovimientosDelMes(movimientos, selectedDate);

    const totalGastosMes = movimientosDelMes
        .filter((m) => m.type === "expense")
        .reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

    movimientosDelMes
        .filter((movimiento) => movimiento.type === "expense")
        .forEach((movimiento) => {
            const categoryId = movimiento.categoryId || "sin-categoria";
            const current = gastosMap.get(categoryId) || {
                id: categoryId,
                nombre: nombresCategorias.get(categoryId) || "Sin categoría",
                total: 0,
                porcentaje: 0,
            };

            const newTotal = current.total + (Number(movimiento.amount) || 0);
            gastosMap.set(categoryId, {
                ...current,
                total: newTotal,
                porcentaje:
                    totalGastosMes > 0 ? (newTotal / totalGastosMes) * 100 : 0,
            });
        });

    return [...gastosMap.values()].sort((a, b) => b.total - a.total);
}

export function getIngresosDelMes(movimientos = [], selectedDate) {
    return getMovimientosDelMes(movimientos, selectedDate)
        .filter((movimiento) => movimiento.type === "income")
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
}

export function getEvolucionMensual(movimientos = [], selectedDate, months = 6) {
    const refDate = getDate(selectedDate);
    const startDate = new Date(
        refDate.getFullYear(),
        refDate.getMonth() - (months - 1),
        1
    );

    return Array.from({ length: months }, (_, index) => {
        const monthDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + index,
            1
        );
        const resumen = getResumenMensual(movimientos, monthDate);

        return {
            label: monthDate.toLocaleDateString("es-PE", {
                month: "short",
            }),
            fullLabel: monthDate.toLocaleDateString("es-PE", {
                month: "short",
                year: "numeric",
            }),
            rawDate: monthDate,
            ingresos: resumen.ingresos,
            gastos: resumen.gastos,
            balance: resumen.balance,
        };
    });
}

