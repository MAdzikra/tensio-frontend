import { useState } from 'react';
import {
  ClipboardList,
  Filter,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Eye,
  Heart,
  Activity,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { apiFetch } from '../../lib/api';
import { useEffect } from 'react';
import { formatDate } from '../../lib/utils';

interface AdminScreening {
  id: number;
  user_name: string;
  created_at: string;
  prediction: string;

  age: number;
  gender: string;
  bmi: number;

  systolic: number;
  diastolic: number;

  salt_intake: number;
  sleep_duration: number;
  smoking_status: boolean;
  exercise_level: string;
  family_history: boolean;
  stress_level: number;
}

export function AdminScreeningsPage() {
  const [screenings, setScreenings] = useState<AdminScreening[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [selectedScreening, setSelectedScreening] = useState<AdminScreening | null>(null);
  const allScreenings = screenings;

  useEffect(() => {
   fetchScreenings();
  }, []);

  const fetchScreenings = async () => {
    try {
      const data = await apiFetch('/admin/screenings');
      setScreenings(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredScreenings = allScreenings.filter((screening) => {
    if (filterRisk === 'all') return true;
    if (filterRisk === 'at-risk') return screening.prediction === 'Berisiko';
    if (filterRisk === 'not-at-risk') return screening.prediction === 'Tidak Berisiko';
    return true;
  });

  const getPredictionColor = (prediction: string) => {
    return prediction === 'Berisiko'
      ? 'bg-red-500'
      : 'bg-green-500';
  };

  const handleViewDetail = (screening: AdminScreening) => {
    setSelectedScreening(screening);
  };

  if (loading) return <div className="p-10 text-center">Loading screenings...</div>;
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
            Monitoring & Audit Skrining
          </h1>
          <p className="text-gray-600">
            Total {allScreenings.length} data skrining dari semua pengguna
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-[200px] h-11 rounded-xl">
              <SelectValue placeholder="Filter hasil prediksi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Hasil</SelectItem>
              <SelectItem value="not-at-risk">Tidak Berisiko</SelectItem>
              <SelectItem value="at-risk">Berisiko</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-blue-50 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1 font-medium">Total Skrining</p>
              <p className="text-3xl font-bold text-blue-900">{filteredScreenings.length}</p>
            </div>
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-green-50 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1 font-medium">Tidak Berisiko</p>
              <p className="text-3xl font-bold text-green-900">
                {filteredScreenings.filter((s) => s.prediction === 'Tidak Berisiko').length}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-red-50 border-2 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1 font-medium">Berisiko</p>
              <p className="text-3xl font-bold text-red-900">
                {filteredScreenings.filter((s) => s.prediction === 'Berisiko').length}
              </p>
            </div>
            <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Screenings Table */}
      {filteredScreenings.length === 0 ? (
        <Card className="p-12 text-center">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">Tidak ada data</h3>
          <p className="text-gray-500">Tidak ada data skrining dengan filter yang dipilih</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#1F2937]">
                    Nama Pengguna
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#1F2937]">
                    Tanggal Skrining
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-[#1F2937]">
                    Hasil Prediksi
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-[#1F2937]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredScreenings.map((screening) => (
                  <tr key={screening.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-[#2563EB]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1F2937]">{screening.user_name}</p>
                          <p className="text-xs text-gray-500">
                            {screening.gender === 'male' ? 'Laki-laki' : 'Perempuan'} •{' '}
                            {screening.age} tahun
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{formatDate(screening.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge className={`${getPredictionColor(screening.prediction)} text-white`}>
                        {screening.prediction}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        onClick={() => handleViewDetail(screening)}
                        variant="outline"
                        size="sm"
                        className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Detail Side Panel */}
      <Sheet open={selectedScreening !== null} onOpenChange={() => setSelectedScreening(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto px-6">
          {selectedScreening && (
            <>
              <SheetHeader className="mb-6 border-b pb-5">
                <SheetTitle className="text-2xl font-bold text-[#1F2937]">
                  Detail Audit Skrining
                </SheetTitle>
                <SheetDescription>
                  Informasi lengkap hasil prediksi dan parameter input pengguna
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* RESULT */}
                <Card
                  className={`p-5 border-2 ${
                    selectedScreening.prediction === 'Berisiko'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Hasil Prediksi Model</p>
                      <Badge
                        className={`${getPredictionColor(selectedScreening.prediction)} text-white px-4 py-1 text-sm`}
                      >
                        {selectedScreening.prediction}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-3">
                        Tanggal Skrining: {formatDate(selectedScreening.created_at)}
                      </p>
                    </div>

                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        selectedScreening.prediction === 'Berisiko'
                          ? 'bg-red-500'
                          : 'bg-green-500'
                      }`}
                    >
                      {selectedScreening.prediction === 'Berisiko' ? <AlertCircle  className="w-7 h-7 text-white" /> : <CheckCircle  className="w-7 h-7 text-white" />}
                    </div>
                  </div>
                </Card>

                {/* USER INFO */}
                <div>
                  <h3 className="font-bold text-[#1F2937] mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#2563EB]" />
                    Informasi Pengguna
                  </h3>

                  <Card className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Nama</p>
                        <p className="font-semibold text-[#1F2937]">{selectedScreening.user_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Usia</p>
                        <p className="font-semibold text-[#1F2937]">{selectedScreening.age} tahun</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Jenis Kelamin</p>
                        <p className="font-semibold text-[#1F2937]">
                          {selectedScreening.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">BMI</p>
                        <p className="font-semibold text-[#1F2937]">
                          {selectedScreening.bmi?.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* HEALTH METRICS */}
                <div>
                  <h3 className="font-bold text-[#1F2937] mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Parameter Kesehatan
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4">
                      <p className="text-xs text-gray-500">Sistolik</p>
                      <p
                        className={`text-xl font-bold ${
                          selectedScreening.systolic >= 140 ? 'text-red-600' : 'text-[#1F2937]'
                        }`}
                      >
                        {selectedScreening.systolic} mmHg
                      </p>
                    </Card>

                    <Card className="p-4">
                      <p className="text-xs text-gray-500">Diastolik</p>
                      <p
                        className={`text-xl font-bold ${
                          selectedScreening.diastolic >= 90 ? 'text-red-600' : 'text-[#1F2937]'
                        }`}
                      >
                        {selectedScreening.diastolic} mmHg
                      </p>
                    </Card>

                    <Card className="p-4">
                      <p className="text-xs text-gray-500">Riwayat Keluarga</p>
                      <p
                        className="text-xl font-bold text-[#1F2937]"
                      >
                        {selectedScreening.family_history ? 'Ada' : 'Tidak Ada'}
                      </p>
                    </Card>

                    <Card className="p-4">
                      <p className="text-xs text-gray-500">Status BMI</p>
                      <p
                        className={`text-base text-xl font-bold ${
                          selectedScreening.bmi >= 25 ? 'text-orange-600' : 'text-[#1F2937]'
                        }`}
                      >
                        {selectedScreening.bmi >= 25 ? 'Berlebih' : 'Normal'}
                      </p>
                    </Card>
                  </div>
                </div>

                {/* LIFESTYLE FACTORS */}
                <div>
                  <h3 className="text-xl font-bold text-[#1F2937] mb-3 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-[#2563EB]" />
                    Faktor Gaya Hidup
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4">
                      <p className="text-xs text-gray-500">Konsumsi Garam</p>
                      <p className="text-xl font-bold text-[#1F2937]">{selectedScreening.salt_intake} g/hari</p>
                    </Card>

                    <Card className="p-4">
                      <p className="text-xs text-gray-500">Stress</p>
                      <p
                        className={`text-xl font-bold ${
                          selectedScreening.stress_level >= 7 ? 'text-red-600' : 'text-[#1F2937]'
                        }`}
                      >
                        {selectedScreening.stress_level}/10
                      </p>
                    </Card>

                    <Card className="p-4">
                      <p className="text-xs text-gray-500">Durasi Tidur</p>
                      <p
                        className={`text-xl font-bold ${
                          selectedScreening.sleep_duration < 6 ? 'text-orange-600' : 'text-[#1F2937]'
                        }`}
                      >
                        {selectedScreening.sleep_duration} jam
                      </p>
                    </Card>

                    <Card className="p-4">
                      <p className="text-xs text-gray-500">Merokok</p>
                      <p
                        className="text-xl font-bold text-[#1F2937]"
                      >
                        {selectedScreening.smoking_status ? 'Ya' : 'Tidak'}
                      </p>
                    </Card>

                    <Card className="p-4 col-span-2">
                      <p className="text-xs text-gray-500 mb-2">Tingkat Olahraga</p>
                      <p className="text-xl font-bold text-[#1F2937]">
                        {selectedScreening.exercise_level === 'high'
                          ? 'Tinggi'
                          : selectedScreening.exercise_level === 'medium'
                          ? 'Sedang'
                          : 'Rendah'}
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
