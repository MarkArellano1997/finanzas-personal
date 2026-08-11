"use client";

import useCategoryStore from "@/stores/categoryStore";

import CategoryCard from "./CategoryCard";

export default function CategoryList({ onEdit }) {
    const categorias = useCategoryStore((state) => state.categorias);

    if (categorias.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed bg-white p-8 text-center">
                <h3 className="font-semibold">No tienes categorías todavía</h3>

                <p className="mt-1 text-sm text-slate-500">
                    Crea una categoría para organizar tus gastos.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {categorias.map((category) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}
