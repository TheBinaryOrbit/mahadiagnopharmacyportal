import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import baseUrl from '../utils/baseUrl';
import { useGetVendor } from '../hooks/useGetVendor';
import { useNavigate } from 'react-router-dom';

function Medicine() {
    const vendor = useGetVendor();
    const [medicines, setMedicines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Calculate stats
    const stats = {
        totalMedicines: medicines.length,
        totalCategories: [...new Set(medicines.map(m => m.medicineCategory?.id))].filter(Boolean).length,
        totalValue: medicines.reduce((sum, m) => sum + (m.finalPrice || 0), 0),
        avgPrice: medicines.length > 0 ? (medicines.reduce((sum, m) => sum + (m.finalPrice || 0), 0) / medicines.length).toFixed(2) : 0
    };

    useEffect(() => {
        if (vendor && vendor.id) {
            fetchMedicines();
        }
    }, [vendor]);

    const fetchMedicines = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(
                `${baseUrl}/pharmacy/medicine/getmedicinesbypharmacyvendor/${vendor.id}`
            );
            if (res.data.data) {
                setMedicines(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching medicines:', error);
            toast.error('Failed to fetch medicines');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (medicineId) => {
        if (!window.confirm('Are you sure you want to delete this medicine?')) {
            return;
        }

        try {
            const res = await axios.delete(
                `${baseUrl}/pharmacy/medicine/deactivatemedicine/${medicineId}`
            );
            if (res.status === 200 || res.status === 204) {
                toast.success('Medicine deleted successfully');
                fetchMedicines(); // Refresh the list
            }
        } catch (error) {
            console.error('Error deleting medicine:', error);
            const msg = error?.response?.data?.error || error.message || 'Failed to delete medicine';
            toast.error(msg);
        }
    };

    const handleView = (medicine) => {    
        navigate(`/medicine/${medicine.id}`); // Navigate to medicine detail page
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                {/* Header */}
                {/* <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#009e92]/10 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-[#009e92]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">All Medicines</h1>
                                    <p className="text-sm text-gray-500">Manage your medicine inventory</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Medicines */}
                    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Medicines</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalMedicines}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                    </div>


                    {/* Total Categories */}
                    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Categories</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCategories}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Value */}
                    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalValue.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Average Price */}
                    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Average Price</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.avgPrice}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex justify-end items-center mb-6'>
                    <button className='flex items-center justify-center gap-3 bg-[#009e92] hover:bg-[#007f7a] text-white px-4 py-2 rounded-lg cursor-pointer shadow-xl shadow-[#009e92]/50' onClick={()=> navigate('/add-medicine')}>
                        <svg className="w-4 h-4 text-gray-600 hover:text-gray-800" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Medicine
                    </button>
                    </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">Loading medicines...</p>
                        </div>
                    ) : medicines.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-lg font-medium">No medicines found</p>
                            <p className="text-sm mt-1">Add your first medicine to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            S.No.
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Medicine
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Brand
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rate
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {medicines.map((medicine, index) => (
                                        <tr key={medicine.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {medicine.imageUrl && (
                                                        <img
                                                            src={`${baseUrl.replace('/api/v1', '')}/${medicine.imageUrl}`}
                                                            alt={medicine.name}
                                                            className="w-10 h-10 rounded-lg object-cover mr-3"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {medicine.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {medicine.medicineSubCategory?.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {medicine.medicineCategory?.name}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {medicine.brand}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {medicine.quantityDescription || '-'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ₹{medicine.price}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ₹{medicine.finalPrice}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleView(medicine)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                        title="View Details"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(medicine.id)}
                                                        className="text-red-600 hover:text-red-800 font-medium"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Medicine;
