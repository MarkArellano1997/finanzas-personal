export default function Header() {
    const fecha = new Date().toLocaleDateString("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <header className="px-5 pt-8 pb-6">

            <p className="text-slate-500 capitalize">
                {fecha}
            </p>

            <h1 className="text-3xl font-bold mt-2">
                Buenos días 👋
            </h1>

        </header>
    );
}