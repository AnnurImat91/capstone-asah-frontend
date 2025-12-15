import React, { useState } from 'react';
import { Card, Button, Alert } from '../components/ui';
import { Loader2 } from 'lucide-react';
import { getStatusBadge } from '../data/mocks'; 
import { apiClient } from '../api/apiClient'; 

const NasabahPage = ({ nasabahList, fetchList, token }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); 

    const handleUpdateStatus = async (id, status_call) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null); 
        
        try {
            // PATCH /nasabah/:id/status
            await apiClient(`/api/nasabah/${id}/status`, 'PATCH', { status_call, notes: `Status diperbarui via dashboard ke ${status_call}` }, token);
            setSuccessMessage(`Status nasabah ${id} berhasil diperbarui menjadi ${status_call.toUpperCase()}.`); 
            fetchList(); 
        } catch (err) {
            setError(err.message || 'Gagal memperbarui status nasabah. Cek konsol untuk detail.');
        } finally {
            setIsLoading(false);
            setTimeout(() => setSuccessMessage(null), 3000); 
        }
    };

    if (isLoading) return <div className="text-center p-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" /><p className="mt-2 text-gray-500">Memuat data...</p></div>;
    
    return (
      <div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Tabel Lead Nasabah (Prioritas)</h2>
        <Alert message={error} type="error" />
        <Alert message={successMessage} type="success" />
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Lead</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prob. (Skor)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediksi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Call</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {nasabahList.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-bold ${
                        lead.prediction === 'YES' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(lead.probability * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-semibold ${lead.prediction === 'YES' ? 'text-green-700' : 'text-red-700'}`}>
                            {lead.prediction}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(lead.status_call)}`}>
                        {lead.status_call.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button variant="default" size="sm" className="h-8 px-3 text-xs" onClick={() => handleUpdateStatus(lead.id, 'called')} disabled={isLoading || lead.status_call === 'called'}>
                          Panggil
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => handleUpdateStatus(lead.id, 'success')} disabled={isLoading}>
                          Success
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t text-sm text-gray-500">
            Menampilkan {nasabahList.length} Lead Aktif (menggunakan data Mock/API)
          </div>
        </Card>
      </div>
    );
};

export default NasabahPage;