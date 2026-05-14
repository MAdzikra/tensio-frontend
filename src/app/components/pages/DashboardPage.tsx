import { useNavigate } from 'react-router';
import { 
  Activity, 
  Calendar, 
  TrendingUp, 
  Heart,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { formatDate } from '../../lib/utils';
import { apiFetch } from '../../lib/api';
import { useState, useEffect } from 'react';

export function DashboardPage() {
  const navigate = useNavigate();
  const [latestResult, setLatestResult] = useState<any>(null);
  const [allResults, setAllResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch('/screening/history');

        const results = res || [];

        setAllResults(results);

        if (results.length > 0) {
          setLatestResult(results[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewDetail = (id: number) => {
    navigate(`/app/result?id=${id}`);
  };

  const getRiskColor = (prediction: string) => {
    return prediction === 'Berisiko' ? 'bg-red-500' : 'bg-green-500';
  };

  const healthTips = [
    'Konsumsi makanan rendah garam untuk menjaga tekanan darah tetap normal',
    'Olahraga teratur minimal 30 menit sehari dapat menurunkan risiko hipertensi',
    'Kelola stress dengan meditasi atau aktivitas yang menenangkan',
    'Tidur cukup 7-8 jam sehari sangat penting untuk kesehatan jantung',
  ];

  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] border-0 shadow-xl overflow-hidden relative z-0">
        <div className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-4">
                <Activity className="w-4 h-4 text-white" />
                <span className="text-sm text-white">Skrining Risiko Hipertensi</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Cek Risiko Hipertensi Sekarang
              </h2>
              <p className="text-blue-100 text-lg">
                Lakukan pemeriksaan rutin untuk deteksi dini risiko hipertensi dan dapatkan rekomendasi kesehatan personal.
              </p>
            </div>
            <Button
              onClick={() => navigate('/app/screening')}
              className="bg-white text-[#2563EB] hover:bg-blue-50 px-8 py-6 rounded-xl shadow-lg group"
            >
              <span className="mr-2">Mulai Skrining</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        <div className="absolute top-0 right-0 opacity-10">
          <svg width="300" height="300" viewBox="0 0 200 200">
            <circle cx="100" cy="0" r="100" fill="white"/>
            <circle cx="200" cy="100" r="100" fill="white"/>
          </svg>
        </div>
      </Card>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Status Terakhir</p>
              <h3 className="text-2xl font-bold mb-1">
                {latestResult?.prediction || '-'}
              </h3>
              <p className="text-blue-100 text-sm">
                {latestResult ? `${latestResult.systolic}/${latestResult.diastolic} mmHg` : ''}
              </p>
              {/* <p className="text-green-100 text-sm">
                {latestResult ? formatDate(latestResult.date) : ''}
              </p> */}
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Skrining Terakhir</p>
              <h3 className="text-2xl font-bold mb-1">
                {latestResult ? formatDate(latestResult.created_at) : '-'}
              </h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Total Pemeriksaan</p>
              <h3 className="text-2xl font-bold mb-1">{allResults.length} Riwayat</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tips and Latest Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Tip */}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F2937] mb-2">
                Tips Kesehatan Hari Ini
              </h3>
              <p className="text-gray-700">{randomTip}</p>
            </div>
          </div>
        </Card>

        {/* Latest Result Summary */}
        {latestResult && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-[#1F2937] mb-4">
              Hasil Skrining Terbaru
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tanggal</span>
                <span className="font-medium">{formatDate(latestResult.created_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tekanan Darah</span>
                <span className="font-medium">
                  {latestResult.systolic}/{latestResult.diastolic} mmHg
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium px-3 py-1 rounded-full ${getRiskColor(latestResult.prediction)} text-white`}>
                  {latestResult.prediction}
                </span>
              </div>
            </div>
            <Button
              onClick={() => handleViewDetail(latestResult.id)}
              variant="outline"
              className="w-full mt-4 border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
            >
              Lihat Detail
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
