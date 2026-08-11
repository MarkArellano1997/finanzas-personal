"use client";

import Link from "next/link";

import useCategoryStore from "@/stores/categoryStore";

export default function CategorySelector({ value, onChange }) {
    const categories = useCategoryStore((state) => state.categorias);

    if (categories.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-4 text-center">
                <p className="font-medium">Aún no tienes categorías</p>

                <p className="mt-1 text-sm text-slate-500">
                    Crea una categoría antes de registrar un gasto.
                </p>

                <Link
                    href="/categories"
                    className="mt-3 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    ➕ Agregar categoría
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => {
                const name = category.nombre || category.name;

                return (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() => onChange(category.id)}
                        className={`rounded-2xl border p-4 text-left transition ${value === category.id
                            ? "border-blue-600 bg-blue-50"
                            : "hover:bg-slate-50"
                            }`}
                    >
                        {name}
                    </button>
                );
            })}

            <Link
                href="/categories"
                className="rounded-2xl border border-dashed p-4 text-center font-medium text-slate-600 transition hover:bg-slate-50"
            >
                ➕ Agregar categoría
            </Link>
        </div>
    );
}
