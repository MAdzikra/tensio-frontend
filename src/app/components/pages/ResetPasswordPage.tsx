import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { apiFetch } from '../../lib/api';
import Logo from '../../../assets/Logo.svg';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }

    try {
      await apiFetch(`/auth/reset-password/${token}`, {
        method: 'PUT',
        body: JSON.stringify({
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      setIsSuccess(true);
      toast.success('Password berhasil direset');
    } catch (err: any) {
      toast.error(err.message || 'Reset password gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#60A5FA] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 bg-[#FFFFFF] rounded-2xl flex items-center justify-center">
            <img src={Logo} className="object-fit-contain" />
          </div>
        </div>

        {!isSuccess ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600">
                Masukkan password baru untuk akun Anda
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-xl"
              >
                Simpan Password Baru
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[#2563EB] font-medium hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Login
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>

            <h2 className="text-2xl font-bold text-[#1F2937] mb-3">
              Password Berhasil Direset!
            </h2>
            <p className="text-gray-600 mb-8">
              Sekarang Anda bisa login menggunakan password baru.
            </p>

            <Button
              onClick={() => navigate('/')}
              className="w-full h-12 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-xl"
            >
              Kembali ke Login
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}