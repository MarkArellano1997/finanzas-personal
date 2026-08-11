export function createAccount({
    nombre,
    tipo,
    saldoInicial = 0,
    limiteCredito = null,
    fechaCierre = null,
    fechaPago = null,
}) {
    const now = new Date().toISOString();

    return {
        id: crypto.randomUUID(),

        nombre,

        tipo,

        saldoInicial,

        limiteCredito,

        fechaCierre,

        fechaPago,

        createdAt: now,

        updatedAt: now,
    };
}