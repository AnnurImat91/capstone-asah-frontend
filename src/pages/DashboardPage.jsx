import React from 'react';
import { Users, Check, DollarSign, TrendingUp } from 'lucide-react';
import { StatCard, Card } from '../components/ui'; 
import { LeadVolumeChart } from '../components/charts'; 
import { mockLeadsByMonth } from '../data/mocks'; 

const DashboardStats = ({ summary, totalNasabah, conversionRate }) => {
    const qualifiedLeads = summary.prediction_summary.positive;
    const totalLeads = totalNasabah;
    const highScoreLeads = qualifiedLeads;
    const rate = conversionRate.toFixed(1);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                icon={Users}
                title="Total Lead"
                value={totalLeads.toLocaleString()}
                colorClass="text-indigo-600"
            />
            <StatCard
                icon={Check}
                title="Lead Qualified (YES)"
                value={qualifiedLeads.toLocaleString()}
                colorClass="text-green-600"
            />
            <StatCard
                icon={DollarSign}
                title="Lead Skor Tinggi"
                value={highScoreLeads.toLocaleString()}
                colorClass="text-yellow-600"
            />
            <StatCard
                icon={TrendingUp}
                title="Tingkat Konversi (Mock)"
                value={rate}
                unit="%"
                colorClass="text-pink-600"
            />
        </div>
    );
};

const DashboardPage = ({ summary, totalNasabah, conversionRate }) => {
    const sourceData = {
        Website: Math.round(totalNasabah * 0.4),
        Referral: Math.round(totalNasabah * 0.3),
        Event: Math.round(totalNasabah * 0.2),
        Lainnya: Math.round(totalNasabah * 0.1),
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Ringkasan Lead Scoring</h2>
            <DashboardStats 
                summary={summary} 
                totalNasabah={totalNasabah} 
                conversionRate={conversionRate} 
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Volume Lead & Konversi" className="lg:col-span-2">
                    <LeadVolumeChart leadsByMonth={mockLeadsByMonth} />
                </Card>
                <Card title="Distribusi Sumber Lead (Mock)" description="Berdasarkan sumber masuk">
                    <div className="space-y-3 pt-4">
                        {Object.entries(sourceData).map(([source, count]) => (
                            <div key={source} className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-600">{source}</span>
                                <span className="text-blue-700 font-semibold">{count.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center text-xs text-gray-400">
                        *Data simulasi berdasarkan Total Nasabah.
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;