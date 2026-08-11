"use client";

import useFinanceStore from "@/stores/financeStore";
import MovementItem from "../movement/MovementItem";

export default function RecentMovements() {

    const movimientos = useFinanceStore(
        (state) => state.movimientos
    );

    return (

        <section>

            <h2 className="text-xl font-bold mb-4">

                Últimos movimientos

            </h2>

            {

                movimientos.length === 0 ? (

                    <div className="rounded-2xl bg-slate-100 p-6 text-center">

                        <p className="text-slate-500">

                            Todavía no registras movimientos.

                        </p>

                    </div>

                ) : (

                    <div className="space-y-3">

                        {movimientos.map((movimiento) => (

                            <MovementItem

                                key={movimiento.id}

                                movimiento={movimiento}

                            />

                        ))}

                    </div>

                )

            }

        </section>

    );

}