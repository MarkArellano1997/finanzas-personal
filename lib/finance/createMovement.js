export function createMovement({
    type,
    amount,
    description,
    categoryId = null,
    accountId,
}) {
    return {
        id: crypto.randomUUID(),

        type,

        amount,

        description,

        categoryId,

        accountId,

        createdAt: new Date().toISOString(),
    };
}