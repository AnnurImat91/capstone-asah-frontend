import React from 'react';
import { Card } from '../components/ui'; 
import { LeadScoreDistributionChart } from '../components/charts'; 

const ScoringPage = ({ summary }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6 text-gray-800">Analisis Scoring Prediktif</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Distribusi Hasil Prediksi" description="Jumlah Lead berdasarkan hasil YES/NO dari model.">
            <LeadScoreDistributionChart predictionSummary={summary.prediction_summary} />
        </Card>
        <Card title="Status Panggilan Lead" description="Ringkasan hasil follow-up lead oleh tim sales.">
            <div className="h-80 flex flex-col justify-center p-4 space-y-4">
                {Object.entries(summary.call_tracking_summary).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-lg border-b pb-2">
                        <span className="font-medium text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                        <span className={`text-2xl font-bold ${key === 'pending' ? 'text-yellow-600' : key === 'called' ? 'text-blue-600' : key === 'success' ? 'text-green-600' : 'text-gray-600'}`}>{value}</span>
                    </div>
                ))}
            </div>
        </Card>
    </div>
  </div>
);

export default ScoringPage;