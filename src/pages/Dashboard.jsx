import React, { useState, useEffect } from 'react';
import { useGetVendor } from '../hooks/useGetVendor';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import { useNavigate } from 'react-router-dom';
import { User, Clock, Wallet, DollarSign, Package, ShoppingBag, CheckCircle, XCircle, Truck, Loader2 } from 'lucide-react';

// Sample data for quick actions
const quickActions = [
    { id: 1, name: 'Profile', icon: User, color: '#3B82F6', route: '/profile' },
    { id: 2, name: 'Orders', icon: ShoppingBag, color: '#10B981', route: '/order' },
    { id: 3, name: 'Medicines', icon: Package, color: '#EC4899', route: '/medicine' },
    { id: 4, name: 'Wallet', icon: Wallet, color: '#F59E0B', route: '/wallet' },
    { id: 5, name: 'Payment', icon: DollarSign, color: '#8B5CF6', route: '/payment-method' },
];

const Dashboard = () => {
    const vendor = useGetVendor();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (vendor?.id) {
            fetchDashboardData();
        }
    }, [vendor?.id]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/pharmacy/pharmacyvendor/dashboard/${vendor.id}`);
            setDashboardData(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-5 py-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back! Here's your pharmacy overview</p>
                </div>

                {/* Statistics Cards */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <span className="ml-3 text-gray-600">Loading dashboard data...</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchDashboardData}
                            className="mt-2 text-red-700 underline hover:text-red-800"
                        >
                            Retry
                        </button>
                    </div>
                ) : dashboardData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Medicines Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-gray-600 text-sm font-medium mb-2">Total Medicines</h3>
                                    <p className="text-4xl font-bold text-gray-900">{dashboardData.totalMedicine || 0}</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl">
                                    <Package className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>
                        </div>

                        {/* Orders - Placed */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-gray-600 text-sm font-medium mb-2">Orders Placed</h3>
                                    <p className="text-4xl font-bold text-gray-900">{dashboardData.totalOrders?.placed || 0}</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-xl">
                                    <Clock className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                        </div>

                        {/* Orders - Dispatched */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-gray-600 text-sm font-medium mb-2">Orders Dispatched</h3>
                                    <p className="text-4xl font-bold text-gray-900">{dashboardData.totalOrders?.dispatched || 0}</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-xl">
                                    <Truck className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>
                        </div>

                        {/* Orders - Delivered */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-orange-500 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-gray-600 text-sm font-medium mb-2">Orders Delivered</h3>
                                    <p className="text-4xl font-bold text-gray-900">{dashboardData.totalOrders?.delivered || 0}</p>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-xl">
                                    <CheckCircle className="w-8 h-8 text-orange-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                            <p className="text-gray-600 text-sm mt-1">Access frequently used features</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={action.id}
                                    onClick={() => navigate(action.route)}
                                    className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center cursor-pointer group"
                                >
                                    <div 
                                        className="w-14 h-14 rounded-xl mb-3 flex items-center justify-center group-hover:scale-110 transition-transform"
                                        style={{ backgroundColor: `${action.color}15` }}
                                    >
                                        <Icon 
                                            className="w-7 h-7" 
                                            style={{ color: action.color }}
                                        />
                                    </div>
                                    <span className="text-gray-900 font-semibold text-sm">{action.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;