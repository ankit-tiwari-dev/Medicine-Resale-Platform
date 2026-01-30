import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LayoutDashboard, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch data based on role
            const endpoint = user?.role === 'admin' ? '/admin/medicines' : '/medicines/my-medicines';
            const response = await api.get(endpoint);
            setData(response.data.data);

            // Mock Data
            // setTimeout(() => {
            //     setData([
            //         { id: 1, name: 'Dolo 650', status: 'pending', date: '2025-01-20', image: null },
            //         { id: 2, name: 'Amoxicillin', status: 'approved', date: '2025-01-18', image: null }
            //     ]);
            //     setLoading(false);
            // }, 500);
            setLoading(false);

        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
            setLoading(false);
        }
    };

    const handleVerify = async (id, status) => {
        // await api.patch(`/admin/medicines/${id}/verify`, { status });
        setData(items => items.map(i => i.id === id ? { ...i, status } : i));
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="p-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Medicine</th>
                                    <th className="p-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="p-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                    {user?.role === 'admin' && (
                                        <th className="p-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data?.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-gray-900">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-sm text-gray-500">{item.date}</td>
                                        <td className="p-6">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${item.status === 'approved'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : item.status === 'rejected'
                                                    ? 'bg-red-50 text-red-700 border-red-100'
                                                    : 'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}>
                                                {item.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                                                {item.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                {item.status === 'pending' && <Clock className="w-3 h-3" />}
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </span>
                                        </td>
                                        {user?.role === 'admin' && (
                                            <td className="p-6 text-right space-x-2">
                                                {item.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleVerify(item.id, 'approved')}
                                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-medium transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleVerify(item.id, 'rejected')}
                                                            className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
