export default class Cuenta {
    constructor({
        id,
        nombre,
        tipo,
        saldoInicial = 0,
        limiteCredito = null,
        fechaCierre = null,
        fechaPago = null,
        createdAt,
        updatedAt,
    }) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;

        this.saldoInicial = saldoInicial;

        this.limiteCredito = limiteCredito;
        this.fechaCierre = fechaCierre;
        this.fechaPago = fechaPago;

        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}