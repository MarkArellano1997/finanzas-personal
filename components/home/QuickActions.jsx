import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function QuickActions() {
    return (
        <Card className="rounded-3xl">

            <button className="w-full flex items-center justify-center gap-2 py-4">

                <Plus />

                Registrar Movimiento

            </button>

        </Card>
    );
}