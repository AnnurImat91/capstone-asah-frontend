import React, { useState, useEffect, useCallback } from 'react';
import { LogIn, TrendingUp, Menu, X, Home, Users, BarChart3, Archive, Mail, Loader2, DollarSign, Check, Zap } from 'lucide-react';
import { Button, Alert, Card } from '../components/ui'; // Diperbaiki: Ekstensi .jsx dihapus
import { initialDashboardData, mockNasabahList } from '../data/mocks'; // Diperbaiki: Ekstensi .jsx dihapus
import { apiClient } from '../api/apiClient'; // Diperbaiki: Ekstensi .jsx dihapus
import DashboardPage from '../pages/DashboardPage'; // Diperbaiki: Ekstensi .jsx dihapus
import NasabahPage from '../pages/NasabahPage'; // Diperbaiki: Ekstensi .jsx dihapus
import ScoringPage from '../pages/ScoringPage'; // Diperbaiki: Ekstensi .jsx dihapus
import PredictionPage from '../pages/PredictionPage'; // Diperbaiki: Ekstensi .jsx dihapus

const Header = ({ onLogout }) => (
    <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
      <div className="flex items-center">
        <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
        <h1 className="text-xl font-bold text-gray-800">Lead Score Predictor</h1>
      </div>
      <Button onClick={onLogout} variant="destructive">
        <LogIn className="w-4 h-4 mr-2" />
        Keluar
      </Button>
    </header>
);

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <li className="mb-1">
      <button
        onClick={onClick}
        className={`flex items-center w-full p-3 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        {label}
      </button>
    </li>
);
  
const Sidebar = ({ activeMenu, setActiveMenu, isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const menus = [
        { name: 'Prediksi Baru', icon: Zap, key: 'predict' }, // Menu baru
        { name: 'Statistik & Ringkasan', icon: Home, key: 'dashboard' },
        { name: 'Tabel Lead Nasabah', icon: Users, key: 'nasabah' },
        { name: 'Analisis Scoring', icon: BarChart3, key: 'scoring' },
        { name: 'Memo & Catatan', icon: Archive, key: 'memo' },
        { name: 'Email Marketing', icon: Mail, key: 'email' },
    ];

    return (
        <>
        {/* Toggle button untuk mobile */}
        <div className="md:hidden p-4 border-b bg-white">
            <Button variant="outline" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-full">
            {isMobileMenuOpen ? <X className="h-5 w-5 mr-2" /> : <Menu className="h-5 w-5 mr-2" />}
            Menu
            </Button>
        </div>

        {/* Sidebar utama */}
        <nav
            className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-50 p-4 transition-transform transform md:translate-x-0 ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:static md:block md:shadow-none shadow-xl`}
        >
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Menu Utama</h2>
            <ul>
                {menus.map((menu) => (
                    <NavItem
                        key={menu.key}
                        icon={menu.icon}
                        label={menu.name}
                        isActive={activeMenu === menu.key}
                        onClick={() => {
                            setActiveMenu(menu.key);
                            setIsMobileMenuOpen(false); // Tutup menu setelah klik di mobile
                        }}
                    />
                ))}
            </ul>
        </nav>
        {/* Overlay untuk mobile saat menu terbuka */}
        {isMobileMenuOpen && (
            <div
                className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>
        )}
        </>
    );
};

const ContentView = ({ activeMenu, dashboardData, nasabahList, fetchNasabahList, token }) => {
    const totalNasabah = dashboardData.total_nasabah;
    const conversionRate = totalNasabah > 0 ? (dashboardData.prediction_summary.positive / totalNasabah) * 100 : 0;
    
    switch (activeMenu) {
        case 'predict': // Kasus baru
            return <PredictionPage token={token} fetchNasabahList={fetchNasabahList} />;
        case 'dashboard':
            return <DashboardPage summary={dashboardData} totalNasabah={totalNasabah} conversionRate={conversionRate} />;
        case 'nasabah':
            return <NasabahPage nasabahList={nasabahList} fetchList={fetchNasabahList} token={token} />;
        case 'scoring':
            return <ScoringPage summary={dashboardData} />;
        case 'memo':
            return <Card title="Memo & Catatan" description="Halaman untuk mencatat interaksi lead."><div className="p-4 text-gray-500 italic">Fitur pengembangan selanjutnya: Editor Memo dan Manajemen Catatan.</div></Card>;
        case 'email':
            return <Card title="Email Marketing" description="Halaman untuk mengelola kampanye email lead."><div className="p-4 text-gray-500 italic">Fitur pengembangan selanjutnya: Template Email dan Integrasi Marketing.</div></Card>;
        default:
            return <DashboardPage summary={dashboardData} totalNasabah={totalNasabah} conversionRate={conversionRate} />;
    }
};

const DashboardLayout = ({ onLogout, token }) => {
    const [activeMenu, setActiveMenu] = useState('predict'); // Default ke halaman prediksi
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState(initialDashboardData);
    const [nasabahList, setNasabahList] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Atur ke false agar user bisa langsung ke form prediksi
    const [error, setError] = useState(null); // Variabel error dideklarasikan di sini

    // Fungsi fetch data dashboard
    const fetchDashboardData = useCallback(async () => {
        // Hanya fetch data dashboard jika activeMenu bukan 'predict' atau setelah prediksi berhasil
        if (!token) return; 

        setIsLoading(true);
        try {
            // GET /api/admin/summary 
            const summaryRes = await apiClient('/api/admin/summary', 'GET', null, token);
            // GET /api/nasabah?limit=10
            const nasabahRes = await apiClient('/api/nasabah?limit=10', 'GET', null, token); 

            setDashboardData(summaryRes.data);
            setNasabahList(nasabahRes.data || []);
            setError(null); // Clear error on success
            
        } catch (err) {
            console.warn("Using mock data due to API failure on dashboard fetch.", err);
            // Menampilkan data simulasi
            setDashboardData({
                ...initialDashboardData,
                total_nasabah: 5,
                prediction_summary: { positive: 4, negative: 1 },
                call_tracking_summary: { pending: 2, called: 1, failed: 1, not_interested: 1, success: 0 }
            });
            setNasabahList(mockNasabahList);
            // Set error hanya jika bukan saat pertama kali masuk ke halaman predict
            if(activeMenu !== 'predict') setError('Gagal memuat data dari API. Menampilkan data simulasi. Harap periksa koneksi atau token.');
        } finally {
            setIsLoading(false);
        }
    }, [token, activeMenu]);

    useEffect(() => {
        // Panggil fetchDashboardData hanya jika bukan halaman prediksi saat pertama kali, atau ketika token berubah
        if (token && activeMenu !== 'predict') {
            fetchDashboardData();
        } else if (token && activeMenu === 'dashboard') {
             fetchDashboardData();
        }
    }, [token, activeMenu, fetchDashboardData]);

    // Jika sedang loading data dashboard (bukan loading awal App), tampilkan loader
    if (isLoading && activeMenu !== 'predict') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="ml-3 text-gray-600 font-medium">Memuat Data Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header onLogout={onLogout} />
            {error && <Alert message={error} type="error" className="m-4" />}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <main className="flex-1 p-6 md:p-10 overflow-y-auto pt-4 md:pt-10">
                    <ContentView 
                        activeMenu={activeMenu} 
                        dashboardData={dashboardData} 
                        nasabahList={nasabahList} 
                        fetchNasabahList={fetchDashboardData} 
                        token={token}
                    />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;