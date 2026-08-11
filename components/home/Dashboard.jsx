"use client";

import { useState } from "react";

import MainLayout from "../layout/MainLayout";
import Header from "../layout/Header";
import FloatingButton from "../layout/FloatingButton";

import BalanceCard from "../dashboard/BalanceCard";
import SummaryCards from "../dashboard/SummaryCards";
import RecentMovements from "../dashboard/RecentMovements";

import RegisterMovementSheet from "../movement/RegisterMovementSheet";

export default function Dashboard() {

    const [open, setOpen] = useState(false);

    return (

        <MainLayout>

            <Header />

            <BalanceCard />

            <SummaryCards />

            <RecentMovements />

            <FloatingButton
                onClick={() => setOpen(true)}
            />

            <RegisterMovementSheet
                open={open}
                onOpenChange={setOpen}
            />

        </MainLayout>

    );

}