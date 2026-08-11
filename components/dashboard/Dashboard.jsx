"use client";

import { useState } from "react";

import Header from "./Header";
import BalanceCard from "./BalanceCard";
import SummaryCards from "./SummaryCards";
import RecentMovements from "./RecentMovements";
import AccountsSection from "./AccountsSection";
import UpcomingPayments from "./UpcomingPayments";

import FloatingButton from "../layout/FloatingButton";
import RegisterMovementSheet from "../movement/RegisterMovementSheet";

export default function Dashboard() {

    const [openSheet, setOpenSheet] = useState(false);

    return (
        <main className="min-h-screen bg-slate-100 pb-20">
            <div className="mx-auto min-h-screen max-w-6xl bg-white shadow-sm relative px-4 sm:px-6 lg:px-8 py-6">
                <Header />

                <div className="space-y-6 mt-4">
                    <BalanceCard />

                    <SummaryCards />

                    <UpcomingPayments />

                    <div className="grid gap-6 md:grid-cols-2">
                        <AccountsSection />
                        <RecentMovements />
                    </div>
                </div>

                <FloatingButton
                    onClick={() => setOpenSheet(true)}
                />

                <RegisterMovementSheet
                    open={openSheet}
                    onOpenChange={setOpenSheet}
                />
            </div>
        </main>
    );

}
