"use client";

import { useState } from "react";

import AccountList from "@/components/account/AccountList";
import AccountSheet from "@/components/account/AccountSheet";

export default function AccountsPage() {
    const [openSheet, setOpenSheet] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    function handleNewAccount() {
        setSelectedAccount(null);
        setOpenSheet(true);
    }

    function handleEditAccount(account) {
        setSelectedAccount(account);
        setOpenSheet(true);
    }

    function handleOpenChange(open) {
        setOpenSheet(open);

        if (!open) {
            setSelectedAccount(null);
        }
    }

    return (
        <main className="min-h-screen bg-slate-100">
            <div className="mx-auto min-h-screen max-w-md bg-white">
                <header className="flex items-center justify-between border-b px-4 py-4">
                    <div>
                        <h1 className="text-xl font-bold">Mis cuentas</h1>

                        <p className="text-sm text-slate-500">
                            Administra dónde tienes tu dinero
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleNewAccount}
                        className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        + Cuenta
                    </button>
                </header>

                <section className="space-y-4 px-4 py-5">
                    <AccountList onEdit={handleEditAccount} />
                </section>

                <AccountSheet
                    open={openSheet}
                    onOpenChange={handleOpenChange}
                    account={selectedAccount}
                />
            </div>
        </main>
    );
}
