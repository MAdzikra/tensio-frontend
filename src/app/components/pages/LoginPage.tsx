import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { store } from '../../lib/store';
import Logo from '../../../assets/Logo.svg';
import { apiFetch } from '../../lib/api';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem("token", data.token);
      store.setCurrentUser(data.user.name, data.user.email);
      toast.success(data.message || "Login berhasil!");

      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/app/dashboard");
        }
      }, 800);
    } catch (err: any) {
      toast.error(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
  //   try {
  //     const data = await apiFetch("/auth/google-login", {
  //       method: "POST",
  //       body: JSON.stringify({
  //       token: credentialResponse.credential,
  //       }),
  //     });
      
  //     localStorage.setItem("token", data.token);

  //     if (data.user.role === "admin") {
  //       navigate("/admin/dashboard");
  //     } else {
  //       navigate("/app/dashboard");
  //     }
  //   } catch (err: any) {
  //     alert(err.message);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#60A5FA] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Side - Illustration */}
        <div className="hidden md:block relative bg-gradient-to-br from-[#2563EB] to-[#3B82F6] p-12">
          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                {/* <Activity className="w-7 h-7 text-[#2563EB]" /> */}
                <img src={Logo} className="object-fit-contain" />
              </div>
              <span className="text-3xl font-bold text-white">Tensio</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Cek Risiko Hipertensi <br />Lebih Mudah
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Deteksi dini risiko hipertensi berbasis machine learning untuk membantu Anda menjaga kesehatan sejak awal.
            </p>

            <div className="space-y-4 text-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Cek risiko secara cepat dan cerdas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Dapatkan rekomendasi kesehatan yang tepat</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Lihat riwayat pemeriksaan kapan saja</span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 right-0 opacity-10">
            <svg width="300" height="300" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="white" opacity="0.1"/>
              <circle cx="100" cy="100" r="60" fill="white" opacity="0.1"/>
              <circle cx="100" cy="100" r="40" fill="white" opacity="0.1"/>
            </svg>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-16 h-16 bg-[#FFFFFF] rounded-xl flex items-center justify-center">
              <img src={Logo} className="object-fit-contain" />
              {/* <Activity className="w-6 h-6 text-white" /> */}
            </div>
            <span className="text-2xl font-bold text-[#1F2937]">Tensio</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1F2937] mb-2">
              Masuk ke Akun Anda
            </h2>
            <p className="text-gray-500">
              Masukkan kredensial Anda untuk mengakses aplikasi
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-[#2563EB] focus:ring-[#2563EB] rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              {/* <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Ingat saya
                </label>
              </div> */}
              <Link to="/forgot-password" className="text-sm text-[#2563EB] hover:underline">
                Lupa Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all"
            >
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">atau</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Login Button */}
          <div className="mt-2 w-full flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const data = await apiFetch("/auth/google-login", {
                    method: "POST",
                    body: JSON.stringify({
                      token: credentialResponse.credential,
                    }),
                  });

                  localStorage.setItem("token", data.token);

                  if (data.user.role === "admin") {
                    navigate("/admin/dashboard");
                  } else {
                    navigate("/app/dashboard");
                  }
                } catch (err: any) {
                  alert(err.message);
                }
              }}
              onError={() => {
                alert("Google Login Failed");
              }}
              type='icon'
              {/* text='signin_with'
              logo_alignment='center'
              shape='pill'
              size='large'
              width='100%' */}
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <Link to="/register" className="text-[#2563EB] font-medium hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
