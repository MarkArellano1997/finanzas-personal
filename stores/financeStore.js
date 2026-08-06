import { create } from "zustand";

const useFinanceStore = create((set, get) => ({
    movimientos: [],

    agregarMovimiento: (movimiento) => {
        set((state) => ({
            movimientos: [movimiento, ...state.movimientos],
        }));
    },

    eliminarMovimiento: (id) => {
        set((state) => ({
            movimientos: state.movimientos.filter(
                (movimiento) => movimiento.id !== id
            ),
        }));
    },

    limpiarMovimientos: () => {
        set({
            movimientos: [],
        });
    },

    obtenerMovimiento: (id) => {
        return get().movimientos.find(
            (movimiento) => movimiento.id === id
        );
    },
}));

export default useFinanceStore;