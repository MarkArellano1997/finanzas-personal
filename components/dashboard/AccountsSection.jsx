"use client";

export default function AccountsSection() {
    return (
        <section className="space-y-3">

            <h2 className="text-xl font-bold">
                Mis cuentas
            </h2>

            <article className="rounded-2xl border bg-white p-4 shadow-sm">

                <div className="flex justify-between items-center">

                    <div>

                        <p className="font-semibold">
                            💵 Billetera
                        </p>

                        <p className="text-sm text-gray-500">
                            Efectivo
                        </p>

                    </div>

                    <strong>
                        S/ 0.00
                    </strong>

                </div>

            </article>

            <article className="rounded-2xl border bg-white p-4 shadow-sm">

                <div className="flex justify-between items-center">

                    <div>

                        <p className="font-semibold">
                            🏦 Cuenta bancaria
                        </p>

                        <p className="text-sm text-gray-500">
                            Sin registrar
                        </p>

                    </div>

                    <strong>
                        S/ 0.00
                    </strong>

                </div>

            </article>

            <article className="rounded-2xl border bg-white p-4 shadow-sm">

                <div className="flex justify-between items-center">

                    <div>

                        <p className="font-semibold">
                            💳 Tarjeta
                        </p>

                        <p className="text-sm text-gray-500">
                            Sin registrar
                        </p>

                    </div>

                    <strong>
                        S/ 0.00
                    </strong>

                </div>

            </article>

        </section>
    );
}