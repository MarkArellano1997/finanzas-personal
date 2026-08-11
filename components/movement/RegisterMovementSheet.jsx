"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import MovementForm from "./MovementForm";

export default function RegisterMovementSheet({
    open,
    onOpenChange,
}) {
    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetContent
                side="bottom"
                className="rounded-t-3xl max-h-[90vh] overflow-y-auto"
            >
                <SheetHeader>

                    <SheetTitle>

                        Registrar movimiento

                    </SheetTitle>

                </SheetHeader>

                <MovementForm
                    onSuccess={() => onOpenChange(false)}
                />

            </SheetContent>
        </Sheet>
    );
}