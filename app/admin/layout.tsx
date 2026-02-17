import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminClient } from '@/components/admin/admin-client';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminClient>
            <div className="min-h-screen bg-muted/40">
                <AdminSidebar />
                <main className="lg:pl-64">
                    <div className="px-4 py-8 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </AdminClient>
    );
}
