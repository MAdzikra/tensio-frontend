import { useState } from 'react';
import { Users, Trash2, Edit, Search, Filter, KeyRound } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { apiFetch } from '../../lib/api';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editFormData, setEditFormData] = useState({
    status: true,
    role: 'user' as 'user' | 'admin',
    newPassword: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
      try {
        const data = await apiFetch('/admin/users');
        setUsers(data);
      } catch (err) {
     console.log(err);
        toast.error('Gagal memuat data pengguna');
      } finally {
        setLoading(false);
      }
    };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = async (userId: number, userName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${userName}"?`)) return;
    try {
      await apiFetch(`/admin/users/${userId}`, {
        method: 'DELETE',
      });

      toast.success('Pengguna berhasil dihapus');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus pengguna');
    }
  };

  const handleEditClick = (user: AdminUser) => {
    setEditingUser(user);
    setEditFormData({
      status: user.is_active,
      role: user.role,
      newPassword: '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      await apiFetch(`/admin/users/${editingUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({
        role: editFormData.role,
        is_active: editFormData.status,
        new_password: editFormData.newPassword || null,
        }),
      });

      toast.success('Data pengguna berhasil diperbarui');
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui pengguna');
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading users...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Kelola Pengguna</h1>
          <p className="text-gray-600">
            Menampilkan {filteredUsers.length} dari {users.length} pengguna terdaftar
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
          <Users className="w-5 h-5 text-[#2563EB]" />
          <span className="font-bold text-[#2563EB]">{users.length}</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl border-gray-300"
            />
          </div>

          {/* Filter by Role */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Filter Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Status */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#1F2937]">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#1F2937]">
                  Email
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-[#1F2937]">
                  Role
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-[#1F2937]">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-[#1F2937]">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1F2937]">{user.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600">{user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      className={
                        user.role === 'admin'
                          ? 'bg-blue-100 text-[#2563EB] hover:bg-blue-100'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                      }
                    >
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      className={
                        user.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                      }
                    >
                      {user.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        onClick={() => handleEditClick(user)}
                        variant="outline"
                        size="sm"
                        className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(user.id, user.name)}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">Tidak ada pengguna</h3>
          <p className="text-gray-500">
            {searchQuery || filterRole !== 'all' || filterStatus !== 'all'
              ? 'Tidak ada pengguna yang sesuai dengan filter'
              : 'Belum ada pengguna yang terdaftar'}
          </p>
        </Card>
      )}

      {/* Edit User Modal */}
      <Dialog open={editingUser !== null} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1F2937]">
              Edit Pengguna
            </DialogTitle>
            <DialogDescription>
              Ubah status, role, atau reset password pengguna
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <div className="space-y-4 py-4">
              {/* User Info (Read-only) */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Nama Lengkap</p>
                <p className="font-medium text-[#1F2937]">{editingUser.name}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium text-[#1F2937]">{editingUser.email}</p>
              </div>

              {/* Editable Fields */}
              <div className="space-y-2">
                <Label>Status Akun</Label>
                <Select
                  value={editFormData.status ? 'active' : 'inactive'}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, status: value === 'active' })
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={editFormData.role}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, role: value as 'user' | 'admin' })
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reset Password (Opsional)</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Masukkan password baru"
                    value={editFormData.newPassword}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, newPassword: e.target.value })
                    }
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Kosongkan jika tidak ingin mereset password
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingUser(null)}
              className="rounded-xl"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
