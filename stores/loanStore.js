import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLoanStore = create(
    persist(
        (set) => ({
            prestamos: [],
            pagos: [],

            agregarPrestamo: (prestamo) =>
                set((state) => ({
                    prestamos: [prestamo, ...state.prestamos],
                })),

            actualizarPrestamo: (id, datos) =>
                set((state) => ({
                    prestamos: state.prestamos.map((p) =>
                        p.id === id
                            ? {
                                  ...p,
                                  ...datos,
                                  updatedAt: new Date().toISOString(),
                              }
                            : p
                    ),
                })),

            eliminarPrestamo: (id) =>
                set((state) => ({
                    prestamos: state.prestamos.filter((p) => p.id !== id),
                    pagos: state.pagos.filter((pago) => pago.loanId !== id),
                })),

            registrarPagoPrestamo: (pago) =>
                set((state) => ({
                    pagos: [pago, ...state.pagos],
                })),

            eliminarPagoPrestamo: (id) =>
                set((state) => ({
                    pagos: state.pagos.filter((p) => p.id !== id),
                })),

            limpiarPrestamos: () =>
                set({
                    prestamos: [],
                    pagos: [],
                }),
        }),
        {
            name: "lukita-loans",
        }
    )
);

export default useLoanStore;
