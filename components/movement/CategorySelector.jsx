"use client";

import { categories } from "@/data/categories";

export default function CategorySelector({
    value,
    onChange,
}) {
    return (
        <div className="grid grid-cols-2 gap-3">

            {categories.map((category) => (

                <button
                    key={category.id}
                    type="button"
                    onClick={() => onChange(category.id)}
                    className={`
                        rounded-2xl
                        border
                        p-4
                        text-left
                        transition

                    ${value === category.id
                                    ? "border-blue-600 bg-blue-50"
                                    : "hover:bg-slate-50"
                                }
                        `}
                >
                    {category.name}
                </button>

            ))}

        </div>
    );
}