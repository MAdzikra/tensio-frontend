import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, TrendingUp, Eye, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { apiFetch } from '../../lib/api';

type Screening = {
  id: number;
  created_at: string;
  prediction: string;
  systolic: number;
  diastolic: number;
};

export function HistoryPage() {
  const navigate = useNavigate();
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [results, setResults] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await apiFetch('/screening/history');
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // mapping backend → frontend label
  const mapRisk = (prediction: string) => {
    return prediction === "Berisiko"
      ? { level: 'at-risk', label: 'Berisiko', color: 'bg-red-500' }
      : { level: 'not-at-risk', label: 'Tidak Berisiko', color: 'bg-green-500' };
  };

  const filteredResults =
    filterRisk === 'all'
      ? results
      : results.filter((r) =>
          filterRisk === 'at-risk'
            ? r.prediction === "Berisiko"
            : r.prediction !== "Berisiko"
        );

  const handleViewDetail = (id: number) => {
    navigate(`/app/result?id=${id}`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID');
  };

  const totalRisk = results.filter(r => r.prediction === "Berisiko").length;
  const totalSafe = results.length - totalRisk;

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
            Riwayat Skrining
          </h1>
          <p className="text-gray-600">
            Total {results.length} pemeriksaan tersimpan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-[200px] h-11 rounded-xl">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="not-at-risk">Tidak Berisiko</SelectItem>
              <SelectItem value="at-risk">Berisiko</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Tidak Berisiko</p>
              <p className="text-2xl font-bold text-green-900">
                {totalSafe}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg"></div>
          </div>
        </Card>

        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1">Berisiko Hipertensi</p>
              <p className="text-2xl font-bold text-red-900">
                {totalRisk}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-lg"></div>
          </div>
        </Card>
      </div>

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            Tidak ada riwayat
          </h3>
          <Button onClick={() => navigate('/app/screening')}>
            Mulai Skrining
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((result) => {
            const risk = mapRisk(result.prediction);

            return(
              <Card 
                key={result.id}
                className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#2563EB]"
                onClick={() => handleViewDetail(result.id)}
              >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Date & Time */}
                <div className="flex items-center gap-3 md:w-48">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1F2937]">
                      {formatDate(result.created_at)}
                    </p>
                    <p className="text-sm text-gray-500">Pemeriksaan</p>
                  </div>
                </div>

                {/* Blood Pressure */}
                <div className="flex items-center gap-2 md:w-40">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-bold text-[#1F2937]">
                      {result.systolic}/{result.diastolic}
                    </p>
                    <p className="text-xs text-gray-500">mmHg</p>
                  </div>
                </div>

                {/* Risk Level */}
                <div className="flex-1">
                  <Badge 
                    className={`${risk.color} text-white px-4 py-2 text-sm`}
                  >
                    {risk.label}
                  </Badge>
                </div>

                {/* Action */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetail(result.id);
                  }}
                  variant="outline"
                  className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat Detail
                </Button>
              </div>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}