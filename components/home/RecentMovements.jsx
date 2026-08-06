import { Card } from "@/components/ui/card";

export default function RecentMovements() {
    return (
        <Card className="rounded-3xl">

            <h3 className="font-semibold">

                Últimos movimientos

            </h3>

            <p className="text-slate-500 mt-4">

                No hay movimientos registrados.

            </p>

        </Card>
    );
}