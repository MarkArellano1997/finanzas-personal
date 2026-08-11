"use client";

import { paymentSources } from "@/data/paymentSources";

export default function PaymentSelector({
    value,
    onChange,
}) {
    return (
        <div className="grid grid-cols-3 gap-3">

            {paymentSources.map((payment) => (

                <button
                    key={payment.id}
                    type="button"
                    onClick={() => onChange(payment.id)}
                    className={`
                        rounded-2xl
                        border
                        p-4
                        transition

                        ${value === payment.id
                                        ? "border-blue-600 bg-blue-50"
                                        : "hover:bg-slate-50"
                                    }
                    `}
                >
                    {payment.name}
                </button>

            ))}

        </div>
    );
}