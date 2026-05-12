import type { ScreeningFormData } from './store';

export function analyzeHypertensionRisk(data: ScreeningFormData) {
  const { 
    systolic, 
    diastolic, 
    age, 
    bmi, 
    smokingStatus, 
    familyHistory, 
    saltIntake,
    stressScore,
    exerciseLevel,
    sleepDuration,
    medicationType
  } = data;

  // Simple decision tree logic for binary classification
  let riskScore = 0;
  let riskLevel: 'not-at-risk' | 'at-risk' = 'not-at-risk';
  let riskLabel = '';
  let recommendation = '';

  // Blood pressure classification (highest weight)
  if (systolic >= 140 || diastolic >= 90) {
    riskScore += 40;
  } else if (systolic >= 130 || diastolic >= 85) {
    riskScore += 25;
  } else if (systolic >= 120 || diastolic >= 80) {
    riskScore += 15;
  }

  // Age factor
  if (age > 65) riskScore += 15;
  else if (age > 45) riskScore += 10;
  else if (age > 35) riskScore += 5;

  // BMI factor
  if (bmi >= 30) riskScore += 10;
  else if (bmi >= 25) riskScore += 5;

  // Lifestyle factors
  if (smokingStatus === 'yes') riskScore += 10;
  if (familyHistory === 'yes') riskScore += 10;
  
  // Salt intake (in grams per day)
  if (saltIntake > 6) riskScore += 8; // High (WHO recommends < 5g/day)
  else if (saltIntake > 5) riskScore += 4; // Moderate

  // Stress score (0-10)
  if (stressScore >= 8) riskScore += 8;
  else if (stressScore >= 6) riskScore += 5;
  else if (stressScore >= 4) riskScore += 2;

  // Exercise level
  if (exerciseLevel === 'low') riskScore += 5;
  else if (exerciseLevel === 'moderate') riskScore += 2;

  // Sleep duration
  if (sleepDuration < 6 || sleepDuration > 9) riskScore += 5;

  // Medication (positive indicator if on medication)
  if (medicationType !== 'none' && medicationType !== '') {
    riskScore += 10; // Taking medication might indicate existing condition
  }

  // Determine risk level based on total score
  // Threshold: >= 35 considered at risk
  if (riskScore >= 35) {
    riskLevel = 'at-risk';
    riskLabel = 'Berisiko Hipertensi';
  } else {
    riskLevel = 'not-at-risk';
    riskLabel = 'Tidak Berisiko';
  }

  // Generate recommendations based on risk level
  if (riskLevel === 'at-risk') {
    recommendation = `
      <strong>⚠️ ANDA BERISIKO HIPERTENSI</strong><br/>
      Berdasarkan analisis data kesehatan Anda, terdapat indikasi risiko hipertensi yang perlu diperhatikan.
      
      <strong>Tindakan yang disarankan:</strong><br/>
      • Konsultasi dengan dokter untuk evaluasi lebih lanjut<br/>
      • Monitoring tekanan darah secara rutin (minimal 2x seminggu)<br/>
      • Pertimbangkan pemeriksaan kesehatan menyeluruh
      
      <strong>Perubahan gaya hidup yang direkomendasikan:</strong><br/>
      • Kurangi konsumsi garam (< 5g/hari atau 1 sendok teh)<br/>
      • Tingkatkan konsumsi buah dan sayuran segar<br/>
      • Olahraga teratur minimal 30 menit, 5 hari per minggu<br/>
      • Kelola stress dengan teknik relaksasi, meditasi, atau yoga<br/>
      • Pertahankan berat badan ideal (BMI 18.5-24.9)<br/>
      • Tidur cukup 7-8 jam per hari
      ${smokingStatus === 'yes' ? '<br/>• <strong>Hentikan kebiasaan merokok segera</strong>' : ''}
      ${saltIntake > 6 ? '<br/>• <strong>Kurangi konsumsi garam drastis</strong>' : ''}
      
      <strong>Pola makan sehat:</strong><br/>
      • Adopsi pola makan DASH (Dietary Approaches to Stop Hypertension)<br/>
      • Pilih protein rendah lemak (ikan, ayam tanpa kulit)<br/>
      • Hindari makanan olahan dan gorengan<br/>
      • Batasi konsumsi kafein dan alkohol<br/>
      • Perbanyak konsumsi kacang-kacangan dan biji-bijian
    `;
  } else {
    recommendation = `
      <strong>✅ ANDA TIDAK BERISIKO HIPERTENSI</strong><br/>
      Berdasarkan analisis data kesehatan Anda saat ini, risiko hipertensi Anda rendah. Pertahankan gaya hidup sehat!
      
      <strong>Tips menjaga kesehatan kardiovaskular:</strong><br/>
      • Lanjutkan pola makan sehat dan seimbang<br/>
      • Tetap aktif dengan olahraga rutin<br/>
      • Istirahat cukup 7-8 jam per hari<br/>
      • Kelola stress dengan baik<br/>
      • Cek tekanan darah secara berkala (minimal 1x/tahun)
      
      <strong>Pencegahan:</strong><br/>
      • Pertahankan berat badan ideal<br/>
      • Batasi konsumsi garam (< 5g/hari)<br/>
      • Hindari merokok dan alkohol berlebihan<br/>
      • Tingkatkan konsumsi sayur dan buah<br/>
      • Jaga hidrasi dengan minum air putih yang cukup (8 gelas/hari)
      
      <strong>Monitoring:</strong><br/>
      • Lakukan skrining kesehatan rutin<br/>
      • Perhatikan perubahan kondisi kesehatan<br/>
      • Catat tekanan darah Anda secara berkala<br/>
      • Konsultasi dokter jika ada gejala yang tidak biasa
    `;
  }

  return {
    riskLevel,
    riskLabel,
    riskScore,
    recommendation,
    systolic,
    diastolic,
  };
}

type BPResult = {
  label: string;
  value: "normal" | "prehypertension" | "hypertension";
};

export function getBPCategory(
  systolic: number,
  diastolic: number
): BPResult {
  if (systolic >= 140 || diastolic >= 90) {
    return {
      label: "Hipertensi Stage 2",
      value: "hypertension",
    };
  } else if (systolic >= 130 || diastolic >= 85) {
    return {
      label: "Hipertensi Stage 1",
      value: "hypertension",
    };
  } else if (systolic >= 120 || diastolic >= 80) {
    return {
      label: "Prehipertensi",
      value: "prehypertension",
    };
  } else {
    return {
      label: "Normal",
      value: "normal",
    };
  }
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function getRiskColor(riskLevel: string) {
  switch (riskLevel) {
    case 'not-at-risk':
      return 'bg-green-500';
    case 'at-risk':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

export function getRiskTextColor(riskLevel: string) {
  switch (riskLevel) {
    case 'not-at-risk':
      return 'text-green-600';
    case 'at-risk':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function getRiskBgColor(riskLevel: string) {
  switch (riskLevel) {
    case 'not-at-risk':
      return 'bg-green-50';
    case 'at-risk':
      return 'bg-red-50';
    default:
      return 'bg-gray-50';
  }
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}