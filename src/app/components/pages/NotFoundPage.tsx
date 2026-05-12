import { useNavigate } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#60A5FA] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-2">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-blue-100 text-lg">
            Maaf, halaman yang Anda cari tidak dapat ditemukan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="bg-white/10 border-white text-white hover:bg-white/20 h-12 px-6 rounded-xl backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </Button>
          
          <Button
            onClick={() => navigate('/app/dashboard')}
            className="bg-white text-[#2563EB] hover:bg-blue-50 h-12 px-6 rounded-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Ke Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
