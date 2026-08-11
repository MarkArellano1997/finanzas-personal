export default function Header() {
    const fecha = new Date().toLocaleDateString("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <header className="p-6">

            <p className="text-sm text-slate-500 capitalize">
                {fecha}
            </p>

            <h1 className="text-3xl font-bold mt-2">
                Hola 👋
            </h1>

            <p className="text-slate-500">
                Bienvenido nuevamente
            </p>

        </header>
    );
}