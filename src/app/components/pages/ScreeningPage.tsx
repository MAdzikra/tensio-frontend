import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  User, 
  Activity, 
  Heart,
  TrendingUp,
  Utensils,
  Brain,
  Moon,
  Ruler,
  Weight,
  Pill,
  Users,
  Cigarette,
  Dumbbell,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { toast } from 'sonner';
import { Progress } from '../ui/progress';
import { getBPCategory } from '../../lib/utils';
import { apiFetch } from '../../lib/api';

export function ScreeningPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [formData, setFormData] = useState<any>({
    age: 30,
    gender: '',
    height: 170,
    weight: 65,
    bmi: 22,
    systolic: 120,
    diastolic: 80,
    saltIntake: '',
    sleepDuration: '',
    smokingStatus: '',
    exerciseLevel: '',
    medicationType: '',
    familyHistory: '',
    stressScore: 5,
  });

  const validateStep1 = () => {
    const newErrors: any = {};

    if (!formData.age || formData.age <= 0) {
      newErrors.age = "Usia wajib diisi";
    }

    if (!formData.gender) {
      newErrors.gender = "Jenis kelamin wajib dipilih";
    }

    if (!formData.height || formData.height <= 0) {
      newErrors.height = "Tinggi badan wajib diisi";
    }

    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = "Berat badan wajib diisi";
    }

    if (!formData.systolic || formData.systolic <= 0) {
      newErrors.systolic = "Tekanan sistolik wajib diisi";
    }

    if (!formData.diastolic || formData.diastolic <= 0) {
      newErrors.diastolic = "Tekanan diastolik wajib diisi";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: any = {};

    if (formData.saltIntake === '' || formData.saltIntake === null) {
      newErrors.saltIntake = "Konsumsi garam wajib diisi";
    }

    if (formData.sleepDuration === '' || formData.sleepDuration === null) {
      newErrors.sleepDuration = "Durasi tidur wajib diisi";
    }

    if (!formData.smokingStatus) {
      newErrors.smokingStatus = "Status merokok wajib dipilih";
    }

    if (!formData.exerciseLevel) {
      newErrors.exerciseLevel = "Aktivitas fisik wajib dipilih";
    }

    if (!formData.medicationType) {
      newErrors.medicationType = "Jenis obat wajib dipilih";
    }

    if (!formData.familyHistory) {
      newErrors.familyHistory = "Riwayat keluarga wajib dipilih";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiFetch("/profile");
        setUser(res);

        setFormData((prev: any) => ({
          ...prev,
          gender: res.gender || '',
          height: res.height || 170,
          weight: res.weight || 65,
          age: calculateAge(res.date_of_birth),
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const calculateAge = (dob: string) => {
    if (!dob) return 30;
    const birth = new Date(dob);
    const diff = Date.now() - birth.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };
  
  useEffect(() => {
    if (formData.height && formData.weight) {
      const h = formData.height / 100;
      const bmi = formData.weight / (h * h);
      setFormData((prev: any) => ({
        ...prev,
        bmi: parseFloat(bmi.toFixed(1))
      }));
    }
  }, [formData.height, formData.weight]);
  
  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: '' }));
  };
  
  const bp = getBPCategory(formData.systolic, formData.diastolic);
  const handleNext = () => {
    if (!validateStep1()) {
      toast.error("Mohon lengkapi semua data pada halaman ini");
      return;
    }
    setCurrentStep(2);
  }
  const handlePrevious = () => setCurrentStep(1);

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validateStep2()) {
      toast.error("Mohon lengkapi semua data sebelum submit");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,

        systolic: formData.systolic,
        diastolic: formData.diastolic,

        salt_intake: formData.saltIntake,
        sleep_duration: formData.sleepDuration,
        stress_level: formData.stressScore,

        bp_history: bp.value,
        medication: formData.medicationType,
        family_history: formData.familyHistory,
        exercise_level: formData.exerciseLevel,
        smoking_status: formData.smokingStatus
      };

      const res = await apiFetch('/screening', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const id = res.data.id;
      navigate(`/app/result?id=${id}`);

    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message || "Terjadi kesalahan saat melakukan analisis"
      );
    } finally {
      setSubmitting(false)
    }
  };

  const progress = (currentStep / totalSteps) * 100;
  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if(!user) return null;

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-2">
          Skrining Risiko Hipertensi
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Isi formulir berikut dengan data akurat untuk mendapatkan hasil analisis yang tepat
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">
            Halaman {currentStep} dari {totalSteps}
          </span>
          <span className="text-sm font-medium text-[#2563EB]">
            {Math.round(progress)}% Selesai
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </Card>

      {/* Form Content */}
      <Card className="p-4 md:p-8">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1F2937]">
                  Informasi Personal
                </h2>
                <p className="text-sm text-gray-600">
                  Data dasar dan pengukuran tubuh Anda
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Usia (tahun)</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData(
                    'age',
                    e.target.value === ''
                      ? ''
                      : parseInt(e.target.value)
                  )}
                  className={`h-12 rounded-xl ${errors.age ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  min="1"
                  max="120"
                />
                {errors.age && (
                  <p className="text-sm text-red-500">
                    {errors.age}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {user.dateOfBirth && `Dihitung dari tanggal lahir: ${new Date(user.dateOfBirth).toLocaleDateString('id-ID')}`}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
                  <SelectTrigger className={`h-12 rounded-xl ${errors.gender ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500">
                    {errors.gender}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-gray-500" />
                  Tinggi Badan (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateFormData(
                    'height',
                    e.target.value === ''
                      ? ''
                      : parseFloat(e.target.value)
                  )}
                  className={`h-12 rounded-xl ${errors.height ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  min="50"
                  max="250"
                />
                {errors.height && (
                  <p className="text-sm text-red-500">
                    {errors.height}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-gray-500" />
                  Berat Badan (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateFormData(
                    'weight',
                    e.target.value === ''
                      ? ''
                      : parseFloat(e.target.value)
                  )}
                  className={`h-12 rounded-xl ${errors.weight ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  min="20"
                  max="300"
                />
                {errors.weight && (
                  <p className="text-sm text-red-500">
                    {errors.weight}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-900">BMI (Indeks Massa Tubuh):</span>
                    <span className="text-2xl font-bold text-purple-900">{formData.bmi}</span>
                  </div>
                  <p className="text-xs text-purple-700 mt-2">
                    Kategori: {' '}
                    {formData.bmi < 18.5 ? 'Kurus' :
                     formData.bmi < 25 ? 'Normal' :
                     formData.bmi < 30 ? 'Overweight' : 'Obesitas'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="systolic" className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-500" />
                  Tekanan Darah Sistolik (mmHg)
                </Label>
                <Input
                  id="systolic"
                  type="number"
                  value={formData.systolic}
                  onChange={(e) => updateFormData(
                    'systolic',
                    e.target.value === ''
                      ? ''
                      : parseInt(e.target.value)
                  )}
                  className={`h-12 rounded-xl ${
                    errors.systolic
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : ''
                  }`}
                  min="70"
                  max="250"
                />
                {errors.systolic && (
                  <p className="text-sm text-red-500">
                    {errors.systolic}
                  </p>
                )}
                <p className="text-xs text-gray-500">Angka atas pada pengukuran tekanan darah</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diastolic" className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-500" />
                  Tekanan Darah Diastolik (mmHg)
                </Label>
                <Input
                  id="diastolic"
                  type="number"
                  value={formData.diastolic}
                  onChange={(e) => updateFormData(
                    'diastolic',
                    e.target.value === ''
                      ? ''
                      : parseInt(e.target.value)
                  )}
                  className={`h-12 rounded-xl ${errors.diastolic ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  min="40"
                  max="150"
                />
                {errors.diastolic && (
                  <p className="text-sm text-red-500">
                    {errors.diastolic}
                  </p>
                )}
                <p className="text-xs text-gray-500">Angka bawah pada pengukuran tekanan darah</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800">
                    <strong>Kategori Tekanan Darah:</strong> {bp.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Lifestyle & Health History */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1F2937]">
                  Gaya Hidup & Riwayat Kesehatan
                </h2>
                <p className="text-sm text-gray-600">
                  Informasi tentang kebiasaan dan riwayat medis Anda
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="saltIntake" className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-gray-500" />
                  Konsumsi Garam (gram/hari)
                </Label>
                <Input
                  id="saltIntake"
                  type="number"
                  value={formData.saltIntake}
                  onChange={(e) => updateFormData(
                    'saltIntake',
                    e.target.value === ''
                      ? ''
                      : parseFloat(e.target.value)
                  )}
                  className={`h-12 rounded-xl ${errors.saltIntake ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  min="0"
                  max="20"
                  step="0.5"
                />
                {errors.saltIntake && (
                  <p className="text-sm text-red-500">
                    {errors.saltIntake}
                  </p>
                )}
                <p className="text-xs text-gray-500">WHO merekomendasikan {'<'} 5 gram per hari</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleepDuration" className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-gray-500" />
                  Durasi Tidur (jam/hari)
                </Label>
                <Input
                  id="sleepDuration"
                  type="number"
                  value={formData.sleepDuration}
                  onChange={(e) => updateFormData(
                    'sleepDuration',
                    e.target.value === ''
                      ? ''
                      : parseFloat(e.target.value)
                  )}
                  className={`h-12 rounded-xl ${errors.sleepDuration ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  min="0"
                  max="24"
                  step="0.5"
                />
                {errors.sleepDuration && (
                  <p className="text-sm text-red-500">
                    {errors.sleepDuration}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="smokingStatus" className="flex items-center gap-2">
                  <Cigarette className="w-5 h-5 text-gray-600" />
                  Status Merokok
                </Label>
                <Select value={formData.smokingStatus} onValueChange={(value) => updateFormData('smokingStatus', value)}>
                  <SelectTrigger className={`h-12 rounded-xl ${errors.smokingStatus ? 'border-red-500 focus-visible:ring-red-500' : ''}`}>
                    <SelectValue placeholder="Pilih status merokok" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Tidak Merokok</SelectItem>
                    <SelectItem value="yes">Ya, Saya Merokok</SelectItem>
                  </SelectContent>
                </Select>
                {errors.smokingStatus && (
                  <p className="text-sm text-red-500">
                    {errors.smokingStatus}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="exerciseLevel" className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-gray-600" />
                  Tingkat Aktivitas Fisik/Olahraga
                </Label>
                <Select value={formData.exerciseLevel} onValueChange={(value) => updateFormData('exerciseLevel', value)}>
                  <SelectTrigger className={`h-12 rounded-xl ${errors.exerciseLevel ? 'border-red-500 focus-visible:ring-red-500' : ''}`}>
                    <SelectValue placeholder="Pilih tingkat aktivitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah (Jarang atau tidak pernah olahraga)</SelectItem>
                    <SelectItem value="moderate">Sedang (1-3 kali per minggu)</SelectItem>
                    <SelectItem value="high">Tinggi (4+ kali per minggu)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.exerciseLevel && (
                  <p className="text-sm text-red-500">
                    {errors.exerciseLevel}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicationType" className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-gray-500" />
                  Jenis Obat yang Dikonsumsi
                </Label>
                <Select value={formData.medicationType} onValueChange={(value) => updateFormData('medicationType', value)}>
                  <SelectTrigger className={`h-12 rounded-xl ${errors.medicationType ? 'border-red-500 focus-visible:ring-red-500' : ''}`}>
                    <SelectValue placeholder="Pilih jenis obat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak Mengonsumsi Obat</SelectItem>
                    <SelectItem value="beta blocker">Beta Blocker</SelectItem>
                    <SelectItem value="diuretic">Diuretik</SelectItem>
                    <SelectItem value="ace inhibitor">ACE Inhibitor</SelectItem>
                    <SelectItem value="other">Obat Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                {errors.medicationType && (
                  <p className="text-sm text-red-500">
                    {errors.medicationType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="familyHistory" className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  Riwayat Hipertensi dalam Keluarga
                </Label>
                <Select value={formData.familyHistory} onValueChange={(value) => updateFormData('familyHistory', value)}>
                  <SelectTrigger className={`h-12 rounded-xl ${errors.familyHistory ? 'border-red-500 focus-visible:ring-red-500' : ''}`}>
                    <SelectValue placeholder="Pilih riwayat keluarga" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Tidak Ada</SelectItem>
                    <SelectItem value="yes">Ada (Orang tua/saudara)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.familyHistory && (
                  <p className="text-sm text-red-500">
                    {errors.familyHistory}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stressScore" className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-gray-500" />
                  Tingkat Stress (0-10): <span className="font-bold text-[#2563EB]">{formData.stressScore}</span>
                </Label>
                <Slider
                  id="stressScore"
                  value={[formData.stressScore]}
                  onValueChange={(value) => updateFormData('stressScore', value[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Tidak Stress</span>
                  <span>Sangat Stress</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Catatan:</strong> Informasi yang Anda berikan akan digunakan untuk analisis risiko hipertensi. 
                  Pastikan semua data yang dimasukkan akurat untuk hasil yang optimal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className={`flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200 ${currentStep === 1 ? "justify-end" : "justify-between"}`}>
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            hidden={currentStep === 1}
            className="w-full sm:w-auto px-6 h-12 rounded-xl order-2 sm:order-1"
          >
            Kembali
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] px-6 h-12 rounded-xl order-1 sm:order-2"
            >
              Selanjutnya
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full sm:w-auto bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] px-8 h-12 rounded-xl shadow-lg shadow-blue-500/30 order-1 sm:order-2"
            >
              {submitting ? (
                <>Sedang Menganalisis...</>
              ) : (
                <>
                  Analisis Sekarang
                  <TrendingUp className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
