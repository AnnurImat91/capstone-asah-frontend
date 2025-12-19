import React, { useState } from 'react';
import { Card, Button, Alert } from '../components/ui'; 
import { Loader2, Phone } from 'lucide-react';
import { getStatusBadge } from '../data/mocks';
import { apiClient } from '../api/apiClient';

const NasabahPage = ({ nasabahList, fetchList, token }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Daftar status yang diizinkan oleh backend
    const validStatuses = [
        { value: 'pending', label: 'Pending' },
        { value: 'called', label: 'Called' },
        { value: 'failed', label: 'Failed' },
        { value: 'not_interested', label: 'Not Interested' }
    ];

    // Fungsi untuk memperbarui status panggilan
    const handleUpdateStatus = async (id, status_call) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        
        try {
            // PATCH /nasabah/:id/status
            await apiClient(`/api/nasabah/${id}/status`, 'PATCH', { 
                status_call, 
                notes: `Status diperbarui via dashboard ke ${status_call}` 
            }, token);
            
            setSuccessMessage(`Status nasabah ${id} berhasil diperbarui menjadi ${status_call.toUpperCase()}.`);
            fetchList(); 
        } catch (err) {
            setError(err.message || 'Gagal memperbarui status nasabah.');
        } finally {
            setIsLoading(false);
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    if (isLoading && !nasabahList.length) return (
        <div className="text-center p-10">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-gray-500">Memuat data...</p>
        </div>
    );
    
    return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Tabel Lead Nasabah (Prioritas)</h2>
        
        <div className="space-y-2 mb-4">
            <Alert message={error} type="error" />
            <Alert message={successMessage} type="success" />
        </div>

        <Card className="p-0 overflow-hidden shadow-sm border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Lead</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Prob. (Skor)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Prediksi</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Call</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Update Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {nasabahList.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-bold ${
                        lead.prediction === 'YES' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(lead.probability * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${lead.prediction === 'YES' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {lead.prediction}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(lead.status_call)}`}>
                        {lead.status_call.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        {/* Tombol Panggil Cepat (Status: Called) */}
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="h-9 px-3 text-xs bg-blue-600 hover:bg-blue-700 shadow-sm"
                          onClick={() => handleUpdateStatus(lead.id, 'called')}
                          disabled={isLoading || lead.status_call === 'called'}
                        >
                          <Phone className="w-3 h-3 mr-1.5" />
                          Panggil
                        </Button>

                        {/* Dropdown Select untuk status lainnya */}
                        <div className="relative">
                          <select
                            className="h-9 w-25 rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                            value={lead.status_call}
                            onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                            disabled={isLoading}
                          >
                            <option value="" disabled>Pilih Status...</option>
                            {validStatuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t bg-gray-50 text-[10px] text-gray-400">
            * Perubahan status pada dropdown akan langsung disimpan ke database secara otomatis.
          </div>
        </Card>
      </div>
    );
};


export default NasabahPage;
