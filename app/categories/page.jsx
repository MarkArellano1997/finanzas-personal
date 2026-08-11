"use client";

import { useState } from "react";

import CategoryList from "@/components/category/CategoryList";
import CategorySheet from "@/components/category/CategorySheet";

export default function CategoriesPage() {
    const [openSheet, setOpenSheet] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    function handleNewCategory() {
        setSelectedCategory(null);
        setOpenSheet(true);
    }

    function handleEditCategory(category) {
        setSelectedCategory(category);
        setOpenSheet(true);
    }

    function handleOpenChange(open) {
        setOpenSheet(open);

        if (!open) {
            setSelectedCategory(null);
        }
    }

    return (
        <main className="min-h-screen bg-slate-100">
            <div className="mx-auto min-h-screen max-w-md bg-white">
                <header className="flex items-center justify-between border-b px-4 py-4">
                    <div>
                        <h1 className="text-xl font-bold">Mis categorías</h1>

                        <p className="text-sm text-slate-500">
                            Organiza tus gastos por categoría
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleNewCategory}
                        className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        + Categoría
                    </button>
                </header>

                <section className="space-y-4 px-4 py-5">
                    <CategoryList onEdit={handleEditCategory} />
                </section>

                <CategorySheet
                    open={openSheet}
                    onOpenChange={handleOpenChange}
                    category={selectedCategory}
                />
            </div>
        </main>
    );
}
