export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-100 pb-24">
            <main className="max-w-md mx-auto">
                {children}
            </main>
        </div>
    );
}