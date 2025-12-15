import React, { useState } from 'react';
import { Card, Button, Input, Alert } from '../components/ui'; 
import { apiClient } from '../api/apiClient'; 
import { Loader2, Zap, Save, CheckCircle, XCircle } from 'lucide-react';

const initialFormData = {
  // Data Nasabah (Hanya untuk Predict + Save)
  name: 'John Doe',
  phone: '08123456789',

  // Data ML API
  age: 35,
  job: 'admin',
  marital: 'married',
  education: 'university.degree',
  default_status: 'no',
  housing: 'yes',
  loan: 'no',
  contact: 'cellular',
  month: 'may',
  day_of_week: 'mon',
  campaign: 1,
  emp_var_rate: 1.1,
  cons_price_idx: 93.994,
  cons_conf_idx: -36.4,
  euribor3m: 4.857,
  nr_employed: 5191
};

// Data dropdown options (disini dibuat statis)
const options = {
    job: ['admin', 'blue-collar', 'entrepreneur', 'housemaid', 'management', 'retired', 'self-employed', 'services', 'student', 'technician', 'unemployed', 'unknown'],
    marital: ['married', 'single', 'divorced', 'unknown'],
    education: ['basic.4y', 'basic.6y', 'basic.9y', 'high.school', 'illiterate', 'professional.course', 'university.degree', 'unknown'],
    default_status: ['no', 'yes', 'unknown'],
    housing: ['no', 'yes', 'unknown'],
    loan: ['no', 'yes', 'unknown'],
    contact: ['cellular', 'telephone'],
    month: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    day_of_week: ['mon', 'tue', 'wed', 'thu', 'fri'],
};

const SelectInput = ({ label, name, value, onChange, options, required = true }) => (
    <div>
        <label className="text-sm font-medium leading-none mb-1 block">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
            {options.map(opt => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1).replace('.', ' ')}</option>
            ))}
        </select>
    </div>
);

const PredictionResult = ({ result, isSaved = false }) => {
    if (!result) return null;

    const isYes = result.label === 'YES';
    const bgColor = isYes ? 'bg-green-500' : 'bg-red-500';
    const Icon = isYes ? CheckCircle : XCircle;

    return (
        <Card className={`mt-6 p-6 ${isYes ? 'border-green-600' : 'border-red-600'} border-4`}>
            <div className="flex items-center space-x-4">
                <Icon className={`h-8 w-8 text-white ${bgColor} p-1 rounded-full`} />
                <div>
                    <h3 className="text-xl font-bold">Hasil Prediksi: <span className={`${isYes ? 'text-green-700' : 'text-red-700'}`}>{result.label}</span></h3>
                    <p className="text-sm text-gray-600">Probabilitas Konversi: **{(result.probability * 100).toFixed(2)}%**</p>
                </div>
            </div>
            <p className="mt-4 text-sm text-gray-700">
                {isYes
                    ? 'Tinggi: Lead ini diprediksi memiliki probabilitas tinggi untuk berlangganan. Prioritaskan follow-up segera.'
                    : 'Rendah: Lead ini diprediksi memiliki probabilitas rendah untuk berlangganan. Perlu nurturing atau sumber daya yang lebih sedikit.'
                }
            </p>
            {isSaved && result.nasabahId && (
                <Alert type="success" message={`Data Nasabah berhasil disimpan dengan ID: ${result.nasabahId}.`} className="mt-4" />
            )}
        </Card>
    );
};


const PredictionPage = ({ token, fetchNasabahList }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: (name === 'age' || name === 'campaign' || name === 'nr_employed') ? parseInt(value) : (name === 'emp_var_rate' || name === 'cons_price_idx' || name === 'cons_conf_idx' || name === 'euribor3m') ? parseFloat(value) : value
    }));
  };

  const handlePredict = async (isSaving) => {
    setError(null);
    setResult(null);
    setIsLoading(true);

    const isProtected = isSaving && token;
    let endpoint = isSaving ? '/nasabah/predict' : '/predict';
    
    // Asumsi apiClient perlu awalan /api
    endpoint = `/api${endpoint}`;

    const predictionData = {
        age: formData.age, job: formData.job, marital: formData.marital, education: formData.education,
        default: formData.default_status, housing: formData.housing, loan: formData.loan, contact: formData.contact,
        month: formData.month, day_of_week: formData.day_of_week, campaign: formData.campaign, 
        emp_var_rate: formData.emp_var_rate, cons_price_idx: formData.cons_price_idx, 
        cons_conf_idx: formData.cons_conf_idx, euribor3m: formData.euribor3m, nr_employed: formData.nr_employed
    };

    let requestBody = predictionData;

    if (isSaving) {
        requestBody = {
            ...predictionData,
            name: formData.name,
            phone: formData.phone,
            default_status: formData.default_status // backend menggunakan default_status, bukan default
        };
        // Hapus 'default' dari body
        delete requestBody.default; 
    } else {
        // Hapus 'default_status' dan ganti menjadi 'default' untuk endpoint /predict (ML API)
        requestBody.default = requestBody.default_status;
        delete requestBody.default_status;
    }

    try {
        const response = await apiClient(endpoint, 'POST', requestBody, isProtected ? token : null);
        
        if (response.success) {
            if (isSaving) {
                setResult({
                    label: response.data.prediction,
                    probability: response.data.probability,
                    nasabahId: response.data.nasabahId,
                });
                fetchNasabahList(); // Muat ulang tabel nasabah di dashboard
            } else {
                setResult({
                    label: response.prediction.label,
                    probability: response.prediction.probability,
                });
            }
        } else {
            setError(response.message || 'Prediksi gagal.');
        }
    } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat memanggil API prediksi.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
            <Zap className="w-6 h-6 mr-3 text-yellow-600" />
            Prediksi Skor Lead Baru
        </h2>
        <Alert message={error} type="error" className="mb-4" />

        <Card title="Data Calon Nasabah">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Data Nasabah (Hanya untuk Predict + Save) */}
                <div className="md:col-span-2">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-1 text-blue-700">Informasi Pribadi (Opsional untuk Simpan)</h3>
                </div>

                <div>
                    <label className="text-sm font-medium leading-none mb-1 block">Nama Lengkap</label>
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="Budi Santoso" />
                    <p className="text-xs text-gray-500 mt-1">Hanya diperlukan jika ingin menyimpan ke database.</p>
                </div>
                <div>
                    <label className="text-sm font-medium leading-none mb-1 block">Nomor Telepon</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="081xxx" />
                </div>
                
                {/* Data ML API */}
                <div className="md:col-span-2 mt-4">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-1 text-blue-700">Data Kredit & Demografi</h3>
                </div>

                <Input label="Usia (Age)" name="age" type="number" value={formData.age} onChange={handleChange} required min="18" placeholder="Usia (Age)" />
                <SelectInput label="Pekerjaan (Job)" name="job" value={formData.job} onChange={handleChange} options={options.job} />
                <SelectInput label="Status Pernikahan (Marital)" name="marital" value={formData.marital} onChange={handleChange} options={options.marital} />
                <SelectInput label="Edukasi (Education)" name="education" value={formData.education} onChange={handleChange} options={options.education} />
                
                <SelectInput label="Status Default" name="default_status" value={formData.default_status} onChange={handleChange} options={options.default_status} />
                <SelectInput label="Pinjaman Rumah (Housing)" name="housing" value={formData.housing} onChange={handleChange} options={options.housing} />
                <SelectInput label="Pinjaman Pribadi (Loan)" name="loan" value={formData.loan} onChange={handleChange} options={options.loan} />
                <SelectInput label="Kontak" name="contact" value={formData.contact} onChange={handleChange} options={options.contact} />

                <SelectInput label="Bulan" name="month" value={formData.month} onChange={handleChange} options={options.month} />
                <SelectInput label="Hari" name="day_of_week" value={formData.day_of_week} onChange={handleChange} options={options.day_of_week} />

                <Input label="Campaign Contact (Campaign)" placeholder="Campaign Contact (Campaign)" name="campaign" type="number" value={formData.campaign} onChange={handleChange} required min="1" />
                
                <div className="md:col-span-2 mt-4">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-1 text-blue-700">Indeks Ekonomi</h3>
                </div>

                <Input label="Employment Variation Rate (Emp Var Rate)" placeholder="Employment Variation Rate (Emp Var Rate)" name="emp_var_rate" type="number" step="0.001" value={formData.emp_var_rate} onChange={handleChange} required />
                <Input label="Consumer Price Index (Cons Price Index)" placeholder="Consumer Price Index (Cons Price Index)" name="cons_price_idx" type="number" step="0.001" value={formData.cons_price_idx} onChange={handleChange} required />
                <Input label="Consumer Confidence Index (Cons Conf Index)" placeholder="Consumer Confidence Index (Cons Conf Index)" name="cons_conf_idx" type="number" step="0.1" value={formData.cons_conf_idx} onChange={handleChange} required />
                <Input label="Euribor 3 Month Rate (Euribor3m)" placeholder="Euribor 3 Month Rate (Euribor3m)" name="euribor3m" type="number" step="0.001" value={formData.euribor3m} onChange={handleChange} required />
                <Input label="Number of Employees (Nr Employed)" placeholder="Number of Employees (Nr Employed)" name="nr_employed" type="number" value={formData.nr_employed} onChange={handleChange} required />
                
            </div>
        </Card>

        <div className="mt-6 flex space-x-4">
            <Button 
                onClick={() => handlePredict(false)} 
                disabled={isLoading} 
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
            >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                Prediksi Cepat (Tanpa Simpan)
            </Button>
            
            <Button 
                onClick={() => handlePredict(true)} 
                disabled={isLoading || !token} 
                className="flex-1"
            >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Prediksi & Simpan Nasabah {token ? '' : '(Perlu Login)'}
            </Button>
        </div>

        {result && <PredictionResult result={result} isSaved={!!result.nasabahId} />}

    </div>
  );
};

export default PredictionPage;