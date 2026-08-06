import Header from "./Header";
import BalanceCard from "./BalanceCard";
import QuickActions from "./QuickActions";
import RecentMovements from "./RecentMovements";

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-slate-100 pb-24">

            <div className="max-w-md mx-auto">

                <Header />

                <div className="px-4 space-y-4">

                    <BalanceCard />

                    <QuickActions />

                    <RecentMovements />

                </div>

            </div>

        </main>
    );
}