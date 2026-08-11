"use client";

import { useForm } from "react-hook-form";

import { createCategory } from "@/lib/finance/createCategory";
import useCategoryStore from "@/stores/categoryStore";

export default function CategoryForm({ category = null, onSuccess }) {
    const agregarCategoria = useCategoryStore(
        (state) => state.agregarCategoria
    );
    const actualizarCategoria = useCategoryStore(
        (state) => state.actualizarCategoria
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            nombre: category?.nombre || category?.name || "",
        },
    });

    function onSubmit(data) {
        const datosCategoria = {
            nombre: data.nombre.trim(),
        };

        if (category) {
            actualizarCategoria(category.id, datosCategoria);
        } else {
            agregarCategoria(createCategory(datosCategoria));
        }

        onSuccess?.();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label className="mb-2 block font-medium" htmlFor="nombre">
                    Nombre
                </label>

                <input
                    id="nombre"
                    type="text"
                    placeholder="Ej. Mascotas"
                    className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("nombre", {
                        required: "Ingresa el nombre de la categoría",
                        validate: (value) =>
                            value.trim().length > 0 ||
                            "Ingresa el nombre de la categoría",
                    })}
                />

                {errors.nombre && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.nombre.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
                {category ? "Guardar cambios" : "Guardar categoría"}
            </button>
        </form>
    );
}
