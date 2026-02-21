import { useAdminUsers } from '../../hooks/useAdminUsers';
import { UserTable } from '../../components/admin/UserTable';
import { AdminToolbar } from '../../components/admin/AdminToolbar';

export function AdminDashboard() {
    const { users, loading, selectedIds, handleAction, toggleSelect, toggleSelectAll } = useAdminUsers();

    if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            <h1 className="text-3xl font-extrabold px-1">User Management</h1>
            <AdminToolbar onAction={handleAction} selectedCount={selectedIds.length} />
            <UserTable
                users={users}
                selectedIds={selectedIds}
                toggleSelect={toggleSelect}
                toggleAll={toggleSelectAll}
            />
        </div>
    );
}
