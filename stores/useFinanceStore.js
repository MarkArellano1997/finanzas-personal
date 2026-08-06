import { create } from "zustand";

const useFinanceStore = create((set) => ({
    movimientos: [],

    agregarMovimiento: (movimiento) =>
        set((state) => ({
            movimientos: [movimiento, ...state.movimientos],
        })),
}));

export default useFinanceStore;