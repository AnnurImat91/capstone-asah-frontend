export const initialDashboardData = {
  total_nasabah: 0,
  prediction_summary: { positive: 0, negative: 0 },
  call_tracking_summary: { pending: 0, called: 0, failed: 0, not_interested: 0, success: 0 },
  recent_activities: [],
};

export const mockNasabahList = [
    { id: 'L001', name: 'Budi Santoso', prediction: 'YES', probability: 0.92, status_call: 'called' },
    { id: 'L002', name: 'Citra Dewi', prediction: 'YES', probability: 0.85, status_call: 'pending' },
    { id: 'L003', name: 'Ahmad Faisal', prediction: 'NO', probability: 0.55, status_call: 'failed' },
    { id: 'L004', name: 'Dewi Sartika', prediction: 'YES', probability: 0.78, status_call: 'not_interested' },
    { id: 'L005', name: 'Eko Prasetyo', prediction: 'YES', probability: 0.95, status_call: 'pending' },
];

export const mockLeadsByMonth = [50, 65, 80, 100, 120, 150, 130, 110, 90, 105, 115, 130];
export const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export const getStatusBadge = (status) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'called':
            return 'bg-green-100 text-green-800';
        case 'not_interested':
            return 'bg-red-100 text-red-800';
        case 'success':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}