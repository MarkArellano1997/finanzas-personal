import { create } from "zustand";
import { persist } from "zustand/middleware";

import { categories as initialCategories } from "@/constants/categories";

const useCategoryStore = create(
    persist(
        (set) => ({
            categorias: initialCategories,

            agregarCategoria: (categoria) =>
                set((state) => ({
                    categorias: [categoria, ...state.categorias],
                })),

            actualizarCategoria: (id, datos) =>
                set((state) => ({
                    categorias: state.categorias.map((categoria) =>
                        categoria.id === id
                            ? {
                                ...categoria,
                                ...datos,
                                updatedAt: new Date().toISOString(),
                            }
                            : categoria
                    ),
                })),

            eliminarCategoria: (id) =>
                set((state) => ({
                    categorias: state.categorias.filter(
                        (categoria) => categoria.id !== id
                    ),
                })),
        }),
        {
            name: "lukita-categories",
        }
    )
);

export default useCategoryStore;
