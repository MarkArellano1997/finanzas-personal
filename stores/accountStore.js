import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAccountStore = create(
    persist(
        (set) => ({
            cuentas: [],

            agregarCuenta: (cuenta) =>
                set((state) => ({
                    cuentas: [
                        cuenta,
                        ...state.cuentas,
                    ],
                })),

            actualizarCuenta: (id, datos) =>
                set((state) => ({
                    cuentas: state.cuentas.map((cuenta) =>
                        cuenta.id === id
                            ? {
                                ...cuenta,
                                ...datos,
                                updatedAt:
                                    new Date().toISOString(),
                            }
                            : cuenta
                    ),
                })),

            eliminarCuenta: (id) =>
                set((state) => ({
                    cuentas: state.cuentas.filter(
                        (cuenta) => cuenta.id !== id
                    ),
                })),

            limpiarCuentas: () =>
                set({
                    cuentas: [],
                }),
        }),
        {
            name: "lukita-accounts",
        }
    )
);

export default useAccountStore;