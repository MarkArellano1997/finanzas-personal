"use client";

import useCategoryStore from "@/stores/categoryStore";

export default function CategoryCard({ category, onEdit }) {
    const eliminarCategoria = useCategoryStore(
        (state) => state.eliminarCategoria
    );

    function handleDelete() {
        const confirmar = window.confirm(
            `¿Eliminar la categoría "${category.nombre || category.name}"?`
        );

        if (confirmar) {
            eliminarCategoria(category.id);
        }
    }

    return (
        <article className="flex items-center justify-between gap-4 rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="min-w-0 truncate text-lg font-semibold">
                {category.nombre || category.name}
            </h3>

            <div className="flex shrink-0 gap-2">
                <button
                    type="button"
                    onClick={() => onEdit?.(category)}
                    className="rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-slate-50"
                >
                    Editar
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                    Eliminar
                </button>
            </div>
        </article>
    );
}
