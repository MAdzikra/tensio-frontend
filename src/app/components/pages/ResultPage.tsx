import { useNavigate, useLocation } from 'react-router';
import { 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';

type ScreeningResult = {
  id: number;
  created_at: string;
  prediction: string;
  probability: number;
  systolic: number;
  diastolic: number;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  salt_intake: number;
  sleep_duration: number;
  smoking_status: boolean;
  exercise_level: string;
  family_history: boolean;
  stress_level: number;
  medication: string;
  recommendations: {
    level: string;
    title: string;
    message: string;
  }[];
};

export function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  useEffect(() => {
    fetchResult();
  }, [id]);



  const fetchResult = async () => {
    try {
      if (!id) {
        navigate('/app/dashboard');
        return;
      }
      const res = await apiFetch(`/screening/${id}`);
      setResult(res);
    } catch (err) {
      console.error(err);
      navigate('/app/dashboard');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!result) return null;

  const isRisk = result.prediction === "Berisiko";

  const getRiskIcon = () => {
    return isRisk
      ? <AlertCircle className="w-16 h-16 text-[#FFFFFF]" />
      : <CheckCircle className="w-16 h-16 text-[#FFFFFF]" />;
  };

  const getRiskLabel = () => {
    return isRisk ? "Berisiko Hipertensi" : "Tidak Berisiko";
  };

  const getBgColor = () => {
    return isRisk ? "bg-red-500" : "bg-green-500";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID");
  };

  // Rekomendasi
  const getRecommendationStyle = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      case "good":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };
  const getRecommendation = () => {
    if (isRisk) {
      return `
        <strong>⚠️ ANDA BERISIKO HIPERTENSI</strong><br/>
        Berdasarkan analisis data kesehatan Anda, terdapat indikasi risiko hipertensi yang perlu diperhatikan.<br /><br />
        
        <strong>Tindakan yang disarankan:</strong><br/>
        • Konsultasi dengan dokter untuk evaluasi lebih lanjut<br/>
        • Monitoring tekanan darah secara rutin (minimal 2x seminggu)<br/>
        • Pertimbangkan pemeriksaan kesehatan menyeluruh<br /><br />
        
        <strong>Perubahan gaya hidup yang direkomendasikan:</strong><br/>
        • Kurangi konsumsi garam (< 2000mg/hari atau 1 sendok teh)<br/>
        • Tingkatkan konsumsi buah dan sayuran segar<br/>
        • Olahraga teratur minimal 30 menit, 5 hari per minggu<br/>
        • Kelola stress dengan teknik relaksasi, meditasi, atau yoga<br/>
        • Pertahankan berat badan ideal (BMI 18.5-24.9)<br/>
        • Tidur cukup 7-8 jam per hari<br /><br />
        
        <strong>Pola makan sehat:</strong><br/>
        • Adopsi pola makan DASH (Dietary Approaches to Stop Hypertension)<br/>
        • Pilih protein rendah lemak (ikan, ayam tanpa kulit)<br/>
        • Hindari makanan olahan dan gorengan<br/>
        • Batasi konsumsi kafein dan alkohol<br/>
        • Perbanyak konsumsi kacang-kacangan dan biji-bijian
      `;
    } else {
      return `
        <strong>✅ ANDA TIDAK BERISIKO HIPERTENSI</strong><br/>
        Berdasarkan analisis data kesehatan Anda saat ini, risiko hipertensi Anda rendah. Pertahankan gaya hidup sehat!<br /><br />
        
        <strong>Tips menjaga kesehatan kardiovaskular:</strong><br/>
        • Lanjutkan pola makan sehat dan seimbang<br/>
        • Tetap aktif dengan olahraga rutin<br/>
        • Istirahat cukup 7-8 jam per hari<br/>
        • Kelola stress dengan baik<br/>
        • Cek tekanan darah secara berkala (minimal 1x/tahun)<br /><br />
        
        <strong>Pencegahan:</strong><br/>
        • Pertahankan berat badan ideal<br/>
        • Batasi konsumsi garam dan gula<br/>
        • Hindari merokok dan alkohol berlebihan<br/>
        • Tingkatkan konsumsi sayur dan buah<br/>
        • Jaga hidrasi dengan minum air putih yang cukup (8 gelas/hari)<br /><br />
        
        <strong>Monitoring:</strong><br/>
        • Lakukan skrining kesehatan rutin<br/>
        • Perhatikan perubahan kondisi kesehatan<br/>
        • Catat tekanan darah Anda secara berkala<br/>
        • Konsultasi dokter jika ada gejala yang tidak biasa
      `;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
          Hasil Skrining Hipertensi
        </h1>
        <p className="text-gray-600">
          Tanggal pemeriksaan: {formatDate(result.created_at)}
        </p>
      </div>

      {/* Main Result Card */}
      <Card className={`p-5 md:p-10 ${getBgColor()} rounded-3xl shadow-xl overflow-hidden`}>
        <div className="text-center">
          <div className="flex justify-center mb-5">
            {getRiskIcon()}
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 break-words">
            {getRiskLabel()}
          </h2>
          <p className="text-white/90 mb-6">
            Berdasarkan analisis machine learning terhadap data kesehatan Anda
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 bg-white/10 px-4 md:px-8 py-4 rounded-2xl max-w-full">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{result.systolic}</div>
              <div className="text-sm text-white/90">Sistolik</div>
            </div>
            <div className="text-3xl text-white">/</div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{result.diastolic}</div>
              <div className="text-sm text-white/90">Diastolik</div>
            </div>
            <div className="text-sm text-white">mmHg</div>
          </div>
        </div>
      </Card>

      {/* User Input Summary */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-[#1F2937] mb-4">
          Ringkasan Data yang Dimasukkan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Usia</p>
            <p className="font-semibold text-[#1F2937]">{result.age || '-'} tahun</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Jenis Kelamin</p>
            <p className="font-semibold text-[#1F2937]">
              {result.gender === 'male' ? 'Laki-laki' : result.gender === 'female' ? 'Perempuan' : '-'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Tinggi / Berat Badan</p>
            <p className="font-semibold text-[#1F2937]">
              {result.height || '-'} cm / {result.weight || '-'} kg
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">BMI</p>
            <p className="font-semibold text-[#1F2937]">{result.bmi.toFixed(1) || '-'} / {result.bmi < 18.5 ? 'Kurus' : result.bmi < 25 ? 'Normal' : result.bmi < 30 ? 'Overweight' : 'Obesitas'}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Tekanan Darah</p>
            <p className="font-semibold text-[#1F2937]">{result.systolic}/{result.diastolic} mmHg</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Konsumsi Garam</p>
            <p className="font-semibold text-[#1F2937]">{result.salt_intake || '-'} gram/hari</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Durasi Tidur</p>
            <p className="font-semibold text-[#1F2937]">{result.sleep_duration || '-'} jam/hari</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Status Merokok</p>
            <p className="font-semibold text-[#1F2937]">
              {result.smoking_status ? "Ya" : "Tidak"}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Aktivitas Fisik</p>
            <p className="font-semibold text-[#1F2937]">
              {result.exercise_level === 'low' ? 'Rendah' : 
               result.exercise_level === 'moderate' ? 'Sedang' :
               result.exercise_level === 'high' ? 'Tinggi' : '-'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Riwayat Keluarga</p>
            <p className="font-semibold text-[#1F2937]">
              {result.family_history ? 'Ada' : 'Tidak Ada'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Tingkat Stress</p>
            <p className="font-semibold text-[#1F2937]">{result.stress_level || '-'} / 10</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Jenis Obat</p>
            <p className="font-semibold text-[#1F2937]">
              {result.medication === 'none' ? 'Tidak Ada' :
               result.medication === 'beta-blocker' ? 'Beta Blocker' :
               result.medication === 'diuretic' ? 'Diuretik' :
               result.medication === 'ace-inhibitor' ? 'ACE Inhibitor' :
               result.medication === 'other' ? 'Lainnya' : '-'}
            </p>
          </div>
        </div>
      </Card>

      {/* Recommendation */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-[#1F2937] mb-5">
          Analisis Hasil & Rekomendasi Kesehatan
        </h3>

        <div className="space-y-4">
          {result.recommendations?.map((rec, index) => (
            <Card
              key={index}
              className={`p-4 border ${getRecommendationStyle(rec.level)}`}
            >
              <h4 className="font-bold text-[#1F2937] mb-2">
                {rec.title}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {rec.message}
              </p>
            </Card>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/app/history')}
          className="h-12 rounded-xl border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Ke Riwayat
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/app/screening')}
          className="h-12 rounded-xl border-gray-300 hover:bg-gray-50"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Ulangi Skrining
        </Button>

        <Button
          onClick={() => navigate('/app/dashboard')}
          className="h-12 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white"
        >
          Ke Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Disclaimer */}
      <Card className="p-4 bg-gray-50">
        <p className="text-xs text-gray-600 text-center">
          <strong>Disclaimer:</strong> Hasil skrining ini bersifat informatif dan tidak menggantikan diagnosis medis profesional. 
          Silakan konsultasikan dengan dokter untuk evaluasi lebih lanjut dan penanganan yang tepat.
        </p>
      </Card>
    </div>
  );
}