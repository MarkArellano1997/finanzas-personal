"use client";

import { Plus } from "lucide-react";

export default function FloatingButton({
    onClick,
}) {
    return (
        <button
            onClick={onClick}
            className="
                fixed
                bottom-8
                left-1/2
                -translate-x-1/2
                h-16
                w-16
                rounded-full
                bg-blue-600
                text-white
                shadow-2xl
                transition
                hover:scale-105
                active:scale-95
                flex
                items-center
                justify-center
                z-50
            "
        >
            <Plus size={32} />
        </button>
    );
}