import { AdminSidebar } from '@/components/admin/sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dark min-h-screen bg-neutral-950">
            <AdminSidebar />
            <main className="lg:pl-64">
                <div className="px-4 py-8 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
