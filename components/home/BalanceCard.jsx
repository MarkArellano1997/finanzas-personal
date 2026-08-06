import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function BalanceCard() {
    return (
        <Card className="rounded-3xl p-5">

            <div className="flex items-center gap-4">

                <div className="bg-blue-100 p-4 rounded-2xl">

                    <Wallet className="text-blue-600" />

                </div>

                <div>

                    <p className="text-slate-500">

                        Disponible

                    </p>

                    <h2 className="text-3xl font-bold">

                        S/ 0.00

                    </h2>

                </div>

            </div>

        </Card>
    );
}