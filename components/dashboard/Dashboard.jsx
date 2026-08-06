import MainLayout from "../layout/MainLayout";
import Header from "../layout/Header";
import BalanceCard from "./BalanceCard";

export default function Dashboard() {
    return (
        <MainLayout>

            <Header />

            <section className="px-5">

                <BalanceCard />

            </section>

        </MainLayout>
    );
}