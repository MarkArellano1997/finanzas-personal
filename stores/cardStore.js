import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCardStore = create(
    persist(
        (set) => ({
            tarjetas: [],
            compras: [],
            pagos: [],

            agregarTarjeta: (tarjeta) =>
                set((state) => ({
                    tarjetas: [tarjeta, ...state.tarjetas],
                })),

            actualizarTarjeta: (id, datos) =>
                set((state) => ({
                    tarjetas: state.tarjetas.map((t) =>
                        t.id === id
                            ? {
                                  ...t,
                                  ...datos,
                                  updatedAt: new Date().toISOString(),
                              }
                            : t
                    ),
                })),

            eliminarTarjeta: (id) =>
                set((state) => ({
                    tarjetas: state.tarjetas.filter((t) => t.id !== id),
                    compras: state.compras.filter((c) => c.cardId !== id),
                    pagos: state.pagos.filter((p) => p.cardId !== id),
                })),

            registrarCompra: (compra) =>
                set((state) => ({
                    compras: [compra, ...state.compras],
                })),

            eliminarCompra: (id) =>
                set((state) => ({
                    compras: state.compras.filter((c) => c.id !== id),
                })),

            registrarPago: (pago) =>
                set((state) => {
                    // Update installment progress on purchases when a payment is made
                    let pagoRestante = Number(pago.monto) || 0;
                    const updatedCompras = state.compras.map((compra) => {
                        if (compra.cardId !== pago.cardId || pagoRestante <= 0) {
                            return compra;
                        }

                        const cuotasTotales = compra.cuotas || 1;
                        const montoCuota = compra.montoCuota || (compra.monto / cuotasTotales);
                        const cuotasPagadasActuales = compra.cuotasPagadas || 0;
                        const cuotasFaltantes = cuotasTotales - cuotasPagadasActuales;

                        if (cuotasFaltantes <= 0) return compra;

                        const cuotasQueCubreElPago = Math.min(
                            cuotasFaltantes,
                            Math.floor(pagoRestante / montoCuota) || (pagoRestante >= (compra.monto - (cuotasPagadasActuales * montoCuota)) ? cuotasFaltantes : 0)
                        );

                        if (cuotasQueCubreElPago > 0) {
                            pagoRestante -= cuotasQueCubreElPago * montoCuota;
                            return {
                                ...compra,
                                cuotasPagadas: cuotasPagadasActuales + cuotasQueCubreElPago,
                                updatedAt: new Date().toISOString(),
                            };
                        }

                        return compra;
                    });

                    return {
                        pagos: [pago, ...state.pagos],
                        compras: updatedCompras,
                    };
                }),

            eliminarPago: (id) =>
                set((state) => ({
                    pagos: state.pagos.filter((p) => p.id !== id),
                })),

            limpiarTarjetas: () =>
                set({
                    tarjetas: [],
                    compras: [],
                    pagos: [],
                }),
        }),
        {
            name: "lukita-cards",
        }
    )
);

export default useCardStore;
