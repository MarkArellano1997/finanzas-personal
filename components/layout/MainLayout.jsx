export default function MainLayout({ children }) {
    return (
        <main className="min-h-screen bg-slate-100">
            <div className="mx-auto max-w-md min-h-screen bg-white shadow-lg relative">
                {children}
            </div>
        </main>
    );
}