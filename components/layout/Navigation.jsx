"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { label: "Dashboard", href: "/", icon: "📊" },
    { label: "Movimientos", href: "/movimientos", icon: "💸" },
    { label: "Cuentas", href: "/accounts", icon: "🏦" },
    { label: "Categorías", href: "/categories", icon: "🏷️" },
    { label: "Reportes", href: "/reportes", icon: "📈" },
    { label: "Tarjetas", href: "/tarjetas", icon: "💳" },
    { label: "Préstamos", href: "/prestamos", icon: "💰" },
];

export default function Navigation() {
    const pathname = usePathname();

    return (
        <>
            {/* Header Navbar para Escritorio (Desktop / Tablet) */}
            <header className="sticky top-0 z-40 hidden border-b bg-white/95 backdrop-blur-xs md:block shadow-2xs">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                    <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-slate-900 tracking-tight">
                        <span className="text-2xl">💰</span>
                        <span>LUKITA</span>
                    </Link>

                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs lg:text-sm font-semibold transition ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-xs"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            {/* Navbar Móvil Inferior (Bottom Bar para Celulares) */}
            <nav aria-label="Navegación móvil" className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-1.5 md:hidden shadow-lg">
                <div className="flex items-center justify-around">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition min-w-[44px] ${
                                    isActive
                                        ? "text-blue-600 font-extrabold"
                                        : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span className="text-[10px] font-medium leading-none mt-0.5 max-w-[50px] truncate text-center">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
