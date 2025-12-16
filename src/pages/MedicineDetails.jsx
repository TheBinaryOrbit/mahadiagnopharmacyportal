import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import baseUrl from '../utils/baseUrl';

function MedicineDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicine, setMedicine] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        price: '',
        finalPrice: '',
        quantityDescription: ''
    });

    useEffect(() => {
        if (id) {
            fetchMedicineDetails();
        }
    }, [id]);

    const fetchMedicineDetails = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${baseUrl}/pharmacy/medicine/getmedicinebyid/${id}`);
            if (res.data.data) {
                const medicineData = res.data.data;
                setMedicine(medicineData);
                setFormData({
                    name: medicineData.name,
                    description: medicineData.description || '',
                    brand: medicineData.brand,
                    price: medicineData.price,
                    finalPrice: medicineData.finalPrice,
                    quantityDescription: medicineData.quantityDescription || ''
                });
            }
        } catch (error) {
            console.error('Error fetching medicine details:', error);
            toast.error('Failed to fetch medicine details');
            navigate('/medicine');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this medicine?')) {
            return;
        }

        try {
            const res = await axios.delete(`${baseUrl}/pharmacy/medicine/deactivatemedicine/${id}`);
            if (res.status === 200 || res.status === 204) {
                toast.success('Medicine deleted successfully');
                navigate('/medicine');
            }
        } catch (error) {
            console.error('Error deleting medicine:', error);
            const msg = error?.response?.data?.error || error.message || 'Failed to delete medicine';
            toast.error(msg);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.brand || !formData.price || !formData.finalPrice) {
            toast.error('Please fill all required fields');
            return;
        }

        setIsSaving(true);
        try {
            const res = await axios.put(
                `${baseUrl}/pharmacy/medicine/updatemedicine/${id}`,
                {
                    name: formData.name,
                    description: formData.description,
                    brand: formData.brand,
                    price: parseFloat(formData.price),
                    finalPrice: parseFloat(formData.finalPrice),
                    quantityDescription: formData.quantityDescription
                }
            );

            if (res.status === 200 || res.status === 201) {
                toast.success('Medicine updated successfully');
                setIsEditing(false);
                fetchMedicineDetails(); // Refresh data
            }
        } catch (error) {
            console.error('Error updating medicine:', error);
            const msg = error?.response?.data?.error || error.message || 'Failed to update medicine';
            toast.error(msg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset form data to original medicine data
        if (medicine) {
            setFormData({
                name: medicine.name,
                description: medicine.description || '',
                brand: medicine.brand,
                price: medicine.price,
                finalPrice: medicine.finalPrice,
                quantityDescription: medicine.quantityDescription || ''
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading medicine details...</p>
                </div>
            </div>
        );
    }

    if (!medicine) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Medicine not found</p>
                    <button
                        onClick={() => navigate('/medicine')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Medicines
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate('/my-medicines')}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">Medicine Details</h1>
                                    <p className="text-sm text-gray-500">View and manage medicine information</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {!isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdate}
                                            disabled={isSaving}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                                        >
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Image */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Medicine Image</h2>
                            {medicine.imageUrl ? (
                                <img
                                    src={`${baseUrl.replace('/api/v1', '')}/${medicine.imageUrl}`}
                                    alt={medicine.name}
                                    className="w-full h-64 object-contain rounded-lg border border-gray-200"
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}

                            {/* Category Info */}
                            <div className="mt-6 space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Category</label>
                                    <p className="text-base text-gray-900 mt-1">{medicine.medicineCategory?.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Subcategory</label>
                                    <p className="text-base text-gray-900 mt-1">{medicine.medicineSubCategory?.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Shop</label>
                                    <p className="text-base text-gray-900 mt-1">{medicine.pharmacyVendor?.shopName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${medicine.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {medicine.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details/Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-6">Medicine Information</h2>

                            {!isEditing ? (
                                /* View Mode */
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Medicine Name</label>
                                        <p className="text-base text-gray-900 mt-1">{medicine.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Brand</label>
                                        <p className="text-base text-gray-900 mt-1">{medicine.brand}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Price</label>
                                        <p className="text-base text-gray-900 mt-1">₹{medicine.price}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Final Price</label>
                                        <p className="text-base mt-1 font-semibold text-green-600">₹{medicine.finalPrice}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Quantity Description</label>
                                        <p className="text-base text-gray-900 mt-1">{medicine.quantityDescription || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Discount</label>
                                        <p className="text-base text-gray-900 mt-1">
                                            {medicine.price && medicine.finalPrice ? 
                                                `₹${(medicine.price - medicine.finalPrice).toFixed(2)} (${(((medicine.price - medicine.finalPrice) / medicine.price) * 100).toFixed(1)}%)` 
                                                : '-'}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-gray-500">Description</label>
                                        <p className="text-base text-gray-900 mt-1">{medicine.description || 'No description available'}</p>
                                    </div>
                                </div>
                            ) : (
                                /* Edit Mode */
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Medicine Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Medicine Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                placeholder="Enter medicine name"
                                            />
                                        </div>

                                        {/* Brand */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Brand <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.brand}
                                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                placeholder="Enter brand name"
                                            />
                                        </div>

                                        {/* Price */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Price (₹) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                placeholder="Enter price"
                                            />
                                        </div>

                                        {/* Final Price */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Final Price (₹) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.finalPrice}
                                                onChange={(e) => setFormData({ ...formData, finalPrice: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                placeholder="Enter final price"
                                            />
                                        </div>

                                        {/* Quantity Description */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quantity Description
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.quantityDescription}
                                                onChange={(e) => setFormData({ ...formData, quantityDescription: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                placeholder="e.g., Strip of 30 Units, Bottle of 50 ML"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                placeholder="Enter medicine description"
                                                rows="4"
                                            />
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MedicineDetails;
