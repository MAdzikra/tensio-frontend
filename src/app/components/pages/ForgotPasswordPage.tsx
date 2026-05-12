import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import Logo from '../../../assets/Logo.svg';
import { toast } from 'sonner';
import { apiFetch } from '../../lib/api';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      setIsSubmitted(true);
      toast.success('Link reset password berhasil dikirim');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengirim email reset');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#60A5FA] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 bg-[#FFFFFF] rounded-2xl flex items-center justify-center">
            <img src={Logo} className="object-fit-contain" />
            {/* <Activity className="w-8 h-8 text-white" /> */}
          </div>
        </div>

        {!isSubmitted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                Lupa Password?
              </h1>
              <p className="text-gray-600">
                Masukkan email Anda dan kami akan mengirimkan link untuk reset password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-300 focus:border-[#2563EB] focus:ring-[#2563EB] rounded-xl"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all"
              >
                Kirim Link Reset
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
              Email Terkirim!
            </h2>
            <p className="text-gray-600 mb-8">
              Kami telah mengirimkan link reset password ke <strong>{email}</strong>. 
              Silakan cek inbox atau folder spam Anda.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/')}
                className="w-full h-12 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white rounded-xl"
              >
                Kembali ke Login
              </Button>
              
              <Button
                onClick={async () => {
                  try {
                    await apiFetch('/auth/forgot-password', {
                      method: 'POST',
                      body: JSON.stringify({ email }),
                    });
                    toast.success('Email reset berhasil dikirim ulang');
                  } catch (err: any) {
                    toast.error(err.message);
                  }
                }}
                variant="outline"
                className="w-full h-12 rounded-xl"
              >
                Kirim Ulang Email
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800 text-center">
            <strong>Catatan:</strong> Link reset password akan kedaluwarsa dalam 1 jam
          </p>
        </div>
      </Card>
    </div>
  );
}
