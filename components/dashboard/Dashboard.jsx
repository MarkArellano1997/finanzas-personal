"use client";

import { useState } from "react";

import Header from "./Header";
import BalanceCard from "./BalanceCard";
import SummaryCards from "./SummaryCards";
import RecentMovements from "./RecentMovements";

import FloatingButton from "../layout/FloatingButton";
import RegisterMovementSheet from "../movement/RegisterMovementSheet";

export default function Dashboard() {

    const [openSheet, setOpenSheet] = useState(false);

    return (
        <main className="min-h-screen bg-slate-100">

            <div className="mx-auto max-w-md bg-white min-h-screen relative">

                <Header />

                <div className="space-y-5 px-4 pb-28">

                    <BalanceCard />

                    <SummaryCards />

                    <RecentMovements />

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