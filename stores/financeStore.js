import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFinanceStore = create(
    persist(
        (set) => ({
            movimientos: [],

            agregarMovimiento: (movimiento) =>
                set((state) => ({
                    movimientos: [
                        movimiento,
                        ...state.movimientos,
                    ],
                })),

            actualizarMovimiento: (id, datos) =>
                set((state) => ({
                    movimientos: state.movimientos.map((m) =>
                        m.id === id
                            ? { ...m, ...datos }
                            : m
                    ),
                })),

            eliminarMovimiento: (id) =>
                set((state) => ({
                    movimientos: state.movimientos.filter(
                        (m) => m.id !== id
                    ),
                })),

            limpiarMovimientos: () =>
                set({
                    movimientos: [],
                }),
        }),
        {
            name: "lukita-storage",
        }
    )
);

export default useFinanceStore;