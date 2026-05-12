import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Edit2, 
  Save,
  Shield,
  Link as LinkIcon,
  Calendar,
  Ruler,
  Weight as WeightIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import { apiFetch } from '../../lib/api';
import { GoogleLogin } from '@react-oauth/google';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const fetchProfile = async () => {
      try {
        const data = await apiFetch('/profile');

        setUser(data);

        setName(data.name || '');
        setEmail(data.email || '');
        setDateOfBirth(data.date_of_birth ? formatDate(data.date_of_birth) : "");
        setGender(data.gender || '');
        setHeight(data.height || 0);
        setWeight(data.weight || 0);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await apiFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          date_of_birth: dateOfBirth,
          gender,
          height,
          weight,
        }),
      });

      setUser(res.data);

      setIsEditing(false);
      toast.success('Profil berhasil diperbarui!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCancel = () => {
    if (!user) return;

    setName(user.name);
    setEmail(user.email);
    setDateOfBirth(user.date_of_birth || '');
    setGender(user.gender || '');
    setHeight(user.height || 0);
    setWeight(user.weight || 0);

    setIsEditing(false);
  };

  const handleGoogleLink = async (credentialResponse: any) => {
    try {
      await apiFetch('/auth/google-login', {
        method: 'POST',
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      toast.success('Akun Google berhasil dihubungkan');
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error('Konfirmasi password tidak sama');
    }

    try {
      if (user.auth_provider === 'google') {
        await apiFetch('/auth/set-password', {
          method: 'POST',
          body: JSON.stringify({
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        });
        
        toast.success('Password berhasil dibuat');
      } else {
        await apiFetch('/auth/change-password', {
          method: 'PUT',
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        });

        toast.success('Password berhasil diubah');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-2">
          Profil Saya
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Kelola informasi akun dan preferensi Anda
        </p>
      </div>

      {/* Profile Card */}
      <Card className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <Avatar className="w-24 h-24 ring-4 ring-[#2563EB] ring-offset-4">
            <AvatarFallback className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white text-3xl">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-1">
              {user.name}
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-4">{user.email}</p>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 rounded-xl"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profil
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Batal
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-6 border-t border-gray-200 pt-6">
          <h3 className="font-bold text-[#1F2937] mb-4">Informasi Personal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                Nama Lengkap
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="h-12 rounded-xl disabled:opacity-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="h-12 rounded-xl disabled:opacity-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Tanggal Lahir
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                disabled={!isEditing}
                className="h-12 rounded-xl disabled:opacity-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                Jenis Kelamin
              </Label>
              <Select 
                value={gender} 
                onValueChange={setGender}
                disabled={!isEditing}
              >
                <SelectTrigger className="h-12 rounded-xl disabled:opacity-100 disabled:cursor-not-allowed">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-gray-500" />
                Tinggi Badan (cm)
              </Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                disabled={!isEditing}
                className="h-12 rounded-xl disabled:opacity-100 disabled:cursor-not-allowed"
                min="50"
                max="250"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2">
                <WeightIcon className="w-4 h-4 text-gray-500" />
                Berat Badan (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                disabled={!isEditing}
                className="h-12 rounded-xl disabled:opacity-100 disabled:cursor-not-allowed"
                min="20"
                max="300"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Connected Account */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <LinkIcon className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-[#1F2937]">Hubungkan Akun</h3>
            <p className="text-sm text-gray-600">Hubungkan akun Anda</p>
          </div>
        </div>
        {user.auth_provider === 'email' && (
          <div className="space-y-3">
            <p className="text-gray-600">Akun Google belum terhubung</p>
            <GoogleLogin onSuccess={handleGoogleLink} onError={() => toast.error('Google auth gagal')} shape='pill' logo_alignment='center' text='continue_with' />
          </div>
        )}

        {(user.auth_provider === 'google' || user.auth_provider === 'both') && (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
            <div>
              <p className="font-medium">Google Account</p>
              <p className="text-sm text-green-600">Terhubung</p>
            </div>
            <Button disabled variant="outline">
              Connected
            </Button>
          </div>
        )}
      </Card>

      {/* Password Management */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-[#1F2937]">{user.has_password ? 'Ubah Password' : 'Atur Password'}</h3>
            <p className="text-sm text-gray-600">Kelola password akun Anda</p>
          </div>
        </div>

        {/* Change Password Form */}
        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
          {(user.has_password) && (
            <div>
              <div className="space-y-2">
                <Label className='mt-3' htmlFor="currentPassword">Password Saat Ini</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Masukkan password saat ini"
                    className="pl-10 h-12 rounded-xl mb-3"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Masukkan password baru"
                  className="pl-10 h-12 rounded-xl"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className='mt-3' htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Konfirmasi password baru"
                  className="pl-10 h-12 rounded-xl"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl"
          >
          {user.has_password ? 'Ubah Password' : 'Atur Password'}
          </Button>
        </form>
      </Card>

      {/* Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800 text-center">
          <strong>Privasi Data:</strong> Semua data Anda tersimpan dengan aman. 
          Kami tidak akan membagikan informasi Anda kepada pihak ketiga tanpa izin Anda.
        </p>
      </Card>
    </div>
  );
}
