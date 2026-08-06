export default function Header() {

    const fecha = new Date().toLocaleDateString("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <header className="px-4 pt-8 pb-6">

            <p className="capitalize text-slate-500">
                {fecha}
            </p>

            <h1 className="text-3xl font-bold mt-2">
                Buenos días 👋
            </h1>

        </header>
    );
}