export const crearMovimiento = ({
    tipo,
    monto,
    categoria,
    metodo,
    descripcion = "",
}) => ({
    id: crypto.randomUUID(),

    fecha: new Date(),

    tipo,

    monto,

    categoria,

    metodo,

    descripcion,
});