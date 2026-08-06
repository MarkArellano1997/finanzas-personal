export function createMovement({
    type,
    amount,
    categoryId,
    paymentSource,
    description = "",
    cardId = null,
}) {
    return {
        id: crypto.randomUUID(),
        type,
        amount: Number(amount),
        categoryId,
        paymentSource,
        description,
        cardId,
        createdAt: new Date().toISOString(),
    };
}