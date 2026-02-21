const TableHeader = ({ onSelectAll, allSelected }) => (
    <thead className="bg-gray-50 dark:bg-gray-900 text-left text-xs uppercase text-gray-500">
        <tr className="border-b">
            <th className="p-3 w-10">
                <input type="checkbox" checked={allSelected} onChange={onSelectAll} className="rounded" />
            </th>
            <th className="p-3">User</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
        </tr>
    </thead>
);

const UserRow = ({ user, isSelected, onToggle }) => (
    <tr className={`border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
        <td className="p-3">
            <input type="checkbox" checked={isSelected} onChange={() => onToggle(user.id)} className="rounded" />
        </td>
        <td className="p-3 font-medium">
            <div>{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
        </td>
        <td className="p-3">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                {user.role}
            </span>
        </td>
        <td className="p-3">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {user.status}
            </span>
        </td>
    </tr>
);

export function UserTable({ users, selectedIds, toggleSelect, toggleAll }) {
    const allSelected = users.length > 0 && selectedIds.length === users.length;

    return (
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
            <table className="w-full text-sm">
                <TableHeader onSelectAll={toggleAll} allSelected={allSelected} />
                <tbody>
                    {users.map(u => (
                        <UserRow key={u.id} user={u} isSelected={selectedIds.includes(u.id)} onToggle={toggleSelect} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
