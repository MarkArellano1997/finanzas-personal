export function createCategory({ nombre }) {
    const now = new Date().toISOString();

    return {
        id: crypto.randomUUID(),
        nombre,
        createdAt: now,
        updatedAt: now,
    };
}
