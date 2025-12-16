import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import baseUrl from '../utils/baseUrl';
import { useGetVendor } from '../hooks/useGetVendor';
import { Edit } from 'lucide-react';
import imageBaseUrl from '../utils/imageBaseUrl';

const Profile = () => {
    const vendor = useGetVendor();
    const [vendorDetails, setVendorDetails] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const [vendorForm, setVendorForm] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        shopName: ''
    });

    const [addressForm, setAddressForm] = useState({
        area: '',
        landmark: '',
        pincode: '',
        district: '',
        state: ''
    });

    useEffect(() => {
        if (vendor?.id) {
            fetchVendorDetails();
        }
    }, [vendor?.id]);

    const fetchVendorDetails = async () => {
        setIsFetching(true);
        setError('');
        try {
            const res = await axios.get(`${baseUrl}/pharmacy/pharmacyvendor/getmypharmacyvendorprofile/${vendor.id}`);
            if (res.status === 200 || res.status === 201) {
                const vendorData = res.data.data;
                setVendorDetails(vendorData);
                setVendorForm({
                    name: vendorData.name || '',
                    email: vendorData.email || '',
                    phoneNumber: vendorData.phoneNumber || '',
                    shopName: vendorData.shopName || ''
                });
                setAddressForm({
                    area: vendorData.address?.area || '',
                    landmark: vendorData.address?.landmark || '',
                    pincode: vendorData.address?.pincode || '',
                    district: vendorData.address?.district || '',
                    state: vendorData.address?.state || ''
                });
                localStorage.setItem('vendor', JSON.stringify(vendorData));
            } else {
                setError('Failed to fetch vendor details');
                toast.error('Failed to fetch vendor details');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Something went wrong';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsFetching(false);
        }
    };

    const handleUpdateVendor = async () => {
        if (!vendorForm.name.trim() || !vendorForm.email.trim() || !vendorForm.phoneNumber.trim() || !vendorForm.shopName.trim()) {
            toast.error('Please fill all fields');
            return;
        }

        setIsUpdating(true);
        try {
            const res = await axios.put(`${baseUrl}/pharmacy/pharmacyvendor/updatepharmacyvendor/${vendor.id}`, {
                name: vendorForm.name.trim(),
                email: vendorForm.email.trim(),
                phoneNumber: vendorForm.phoneNumber.trim(),
                shopName: vendorForm.shopName.trim(),
                address: {
                    area: addressForm.area.trim(),
                    landmark: addressForm.landmark.trim(),
                    pincode: addressForm.pincode.trim(),
                    district: addressForm.district.trim(),
                    state: addressForm.state.trim()
                }
            });

            if (res.status === 200 || res.status === 201) {
                toast.success('Vendor details updated successfully');
                setModalVisible(false);
                fetchVendorDetails();
            } else {
                toast.error('Failed to update vendor details');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update vendor details';
            toast.error(errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setIsUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await axios.put(`${baseUrl}/pharmacy/pharmacyvendor/update/profile-image/${vendor.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200 || res.status === 201) {
                toast.success('Profile image updated successfully');
                fetchVendorDetails();
            } else {
                toast.error('Failed to update profile image');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile image';
            toast.error(errorMessage);
        } finally {
            setIsUploadingImage(false);
        }
    };

    const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;

    const encodedUrl = encodeURI(imageUrl); // Encode spaces and special characters
    console.log('Image URL:', `${imageBaseUrl}${encodedUrl}`);
    return `${imageBaseUrl}${encodedUrl}`;
};


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl">
                {isFetching ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009e92] mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading profile...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-500 mt-4">{error}</p>
                        <button
                            className="mt-4 bg-[#009e92] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#018177] transition-colors"
                            onClick={fetchVendorDetails}
                        >
                            Retry
                        </button>
                    </div>
                ) : vendorDetails ? (
                    <div className="space-y-6">
                        {/* Profile Image Section */}
                        <div className="relative bg-white rounded-2xl shadow-sm p-8 text-center overflow-hidden">
                            {/* Optional subtle SVG curves */}
                            <div className="absolute bottom-0 left-0 w-full opacity-70 overflow-hidden">
                                <svg viewBox="0 0 1000 200" className="w-full h-auto">
                                    <path d="M0,100 C250,50 400,150 600,50 C800,-50 1000,150 1000,100 L1000,200 L0,200 Z" fill="#009e92" />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                <div className="relative inline-block">
                                    <img
                                        src={getImageUrl(vendorDetails.imageUrl)}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-md"
                                    />
                                    <label
                                        htmlFor="profile-image"
                                        className="absolute bottom-0 right-0 bg-gradient-to-r from-[#009e92] to-[#66C9C1] p-2.5 rounded-full cursor-pointer hover:opacity-90 transition-all shadow-md"
                                    >
                                        {isUploadingImage ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        ) : (
                                            <Edit className="w-4 h-4 text-white" />
                                        )}
                                        <input
                                            id="profile-image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            disabled={isUploadingImage}
                                        />
                                    </label>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mt-2">{vendorDetails.name}</h2>
                                <p className="text-gray-600 mt-1">{vendorDetails.email}</p>
                                
                            </div>
                        </div>

                        {/* Vendor Details Section */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Vendor Details</h3>
                                <button
                                    onClick={() => setModalVisible(true)}
                                    className="bg-[#009e92] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#018177] transition-colors"
                                >
                                    Edit
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-500 mb-1">Name</p>
                                        <p className="text-gray-800 font-medium">{vendorDetails.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-500 mb-1">Email</p>
                                        <p className="text-gray-800 font-medium">{vendorDetails.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                                        <p className="text-gray-800 font-medium">{vendorDetails.phoneNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-500 mb-1">Shop Name</p>
                                        <p className="text-gray-800 font-medium">{vendorDetails.shopName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-500 mb-1">Verification Status</p>
                                        <p className={`font-medium ${vendorDetails.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {vendorDetails.isVerified ? 'Verified' : 'Not Verified'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-500 mb-1">Account Status</p>
                                        <p className={`font-medium ${vendorDetails.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                            {vendorDetails.isActive ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Details Section */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Address Details</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm text-gray-500 mb-1">Area</p>
                                        <p className="text-gray-800 font-medium">{vendorDetails.address?.area || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm text-gray-500 mb-1">Landmark</p>
                                        <p className="text-gray-800 font-medium">{vendorDetails.address?.landmark || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm text-gray-500 mb-1">District</p>
                                        <p className="text-gray-800 font-medium">{vendorDetails.address?.district || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm text-gray-500 mb-1">State</p>
                                        <p className="text-gray-800 font-medium">{vendorDetails.address?.state || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm text-gray-500 mb-1">Pincode</p>
                                        <p className="text-gray-800 font-medium">{vendorDetails.address?.pincode || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Update Modal */}
            {isModalVisible && (
                <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800">Update Vendor Details</h2>
                                <button onClick={() => setModalVisible(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:border-[#009e92] focus:ring-2 focus:ring-[#009e92]/20"
                                            placeholder="Enter name"
                                            value={vendorForm.name}
                                            onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:border-[#009e92] focus:ring-2 focus:ring-[#009e92]/20"
                                            placeholder="Enter email"
                                            value={vendorForm.email}
                                            onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:border-[#009e92] focus:ring-2 focus:ring-[#009e92]/20"
                                            placeholder="Enter phone number"
                                            value={vendorForm.phoneNumber}
                                            onChange={(e) => setVendorForm({ ...vendorForm, phoneNumber: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Name *</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:border-[#009e92] focus:ring-2 focus:ring-[#009e92]/20"
                                            placeholder="Enter shop name"
                                            value={vendorForm.shopName}
                                            onChange={(e) => setVendorForm({ ...vendorForm, shopName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-6">Address Information</h3>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Area *</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:border-[#009e92] focus:ring-2 focus:ring-[#009e92]/20"
                                            placeholder="Enter area"
                                            value={addressForm.area}
                                            onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Landmark *</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:border-[#009e92] focus:ring-2 focus:ring-[#009e92]/20"
                                            placeholder="Enter landmark"
                                            value={addressForm.landmark}
                                            onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">District *</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:border-[#009e92] focus:ring-2 focus:ring-[#009e92]/20"
                                            placeholder="Enter district"
                                            value={addressForm.district}
                                            onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:border-[#009e92] focus:ring-2 focus:ring-[#009e92]/20"
                                            placeholder="Enter state"
                                            value={addressForm.state}
                                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:border-[#009e92] focus:ring-2 focus:ring-[#009e92]/20"
                                            placeholder="Enter pincode"
                                            value={addressForm.pincode}
                                            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200">
                            <button
                                className="w-full bg-[#009e92] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#018177] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleUpdateVendor}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Updating...
                                    </div>
                                ) : (
                                    'Update Vendor Details'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
