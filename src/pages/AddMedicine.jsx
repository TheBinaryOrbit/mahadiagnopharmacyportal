import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import baseUrl from '../utils/baseUrl';
import { useGetVendor } from '../hooks/useGetVendor';

function AddMedicine() {
    const vendor = useGetVendor();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        price: '',
        finalPrice: '',
        quantityDescription: '',
        medicineCategoryId: '',
        medicineSubCategoryId: '',
        image: null
    });

    // Fetch medicine categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${baseUrl}/pharmacy/medicinecategory/getmedicinecategories`);
            if (res.data.success) {
                setCategories(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch medicine categories');
        }
    };

    // Fetch subcategories when category is selected
    const handleCategorySelect = async (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedSubCategory('');
        setSubCategories([]);
        setShowForm(false);

        if (categoryId) {
            try {
                const res = await axios.get(
                    `${baseUrl}/pharmacy/medicinecategory/getmedicinesubcategoriesbycategoryid/${categoryId}`
                );
                if (res.data.data) {
                    setSubCategories(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                toast.error('Failed to fetch subcategories');
            }
        }
    };

    const handleSubCategorySelect = (subCategoryId) => {
        setSelectedSubCategory(subCategoryId);
        setFormData({
            ...formData,
            medicineCategoryId: selectedCategory,
            medicineSubCategoryId: subCategoryId
        });
        setShowForm(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            setFormData({ ...formData, image: file });

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            description: '',
            brand: '',
            price: '',
            finalPrice: '',
            quantityDescription: '',
            medicineCategoryId: '',
            medicineSubCategoryId: '',
            image: null
        });
        setPreviewImage(null);
        setSubCategories([]);
        setShowForm(false);
        setSelectedCategory('');
        setSelectedSubCategory('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.brand || !formData.price || !formData.finalPrice) {
            toast.error('Please fill all required fields');
            return;
        }

        if (!formData.medicineCategoryId || !formData.medicineSubCategoryId) {
            toast.error('Please select category and subcategory');
            return;
        }

        if (!vendor || !vendor.id) {
            toast.error('Vendor information not found. Please login again.');
            return;
        }

        setIsLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('brand', formData.brand);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('finalPrice', formData.finalPrice);
            formDataToSend.append('quantityDescription', formData.quantityDescription);
            formDataToSend.append('medicineCategoryId', formData.medicineCategoryId);
            formDataToSend.append('medicineSubCategoryId', formData.medicineSubCategoryId);
            formDataToSend.append('pharmacyVendorId', vendor.id);

            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const res = await axios.post(
                `${baseUrl}/pharmacy/medicine/addmedicine`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (res.status === 200 || res.status === 201) {
                toast.success('Medicine added successfully!');
                // Reset form
                setFormData({
                    name: '',
                    description: '',
                    brand: '',
                    price: '',
                    finalPrice: '',
                    quantityDescription: '',
                    medicineCategoryId: '',
                    medicineSubCategoryId: '',
                    image: null
                });
                setPreviewImage(null);
                setSubCategories([]);
                setShowForm(false);
                setSelectedCategory('');
                setSelectedSubCategory('');
            }
        } catch (error) {
            console.error('Error adding medicine:', error);
            const msg = error?.response?.data?.error || error.message || 'Failed to add medicine';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="mx-auto mb-6">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <svg className="w-6 h-6 text-[#009e92]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h1 className="text-xl font-bold text-gray-800">Add New Medicine</h1>
                        </div>
                    </div>

                    {/* Step 1: Select Category */}
                    <div className="p-4 sm:p-6">
                        {!selectedCategory && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Medicine Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => handleCategorySelect(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                    >
                                        <option value="">Select category...</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Select Subcategory */}
                        {selectedCategory && !selectedSubCategory && (
                            <div className="space-y-4">
                                <button
                                    onClick={() => {
                                        setSelectedCategory('');
                                        setSubCategories([]);
                                    }}
                                    className="text-sm text-[#009e92] hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Change Category
                                </button>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Medicine Subcategory <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedSubCategory}
                                        onChange={(e) => handleSubCategorySelect(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                    >
                                        <option value="">Select subcategory...</option>
                                        {subCategories.map((subCategory) => (
                                            <option key={subCategory.id} value={subCategory.id}>
                                                {subCategory.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Medicine Details Form */}
                        {showForm && (
                            <form onSubmit={handleSubmit}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setSelectedSubCategory('');
                                    }}
                                    className="text-sm text-[#009e92] hover:text-blue-700 font-medium flex items-center gap-1 mb-6"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Change Subcategory
                                </button>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                                   {/* Medicine Name */}
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
                                        <div>
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

                                        {/* Medicine Image */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Medicine Image
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009e92] focus:border-transparent text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#009e92]/20  file:text-[#009e92] hover:file:bg-[#009e92]/30 hover:file:cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Description - Full Width */}    
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            placeholder="Enter medicine description"
                                            rows="3"
                                        />
                                    </div>

                                    {/* Image Preview */}
                                    {previewImage && (
                                        <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                                        <div className="relative inline-block">
                                            <img
                                                src={previewImage}
                                                alt="Medicine preview"
                                                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPreviewImage(null);
                                                    setFormData({ ...formData, image: null });
                                                }}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 bg-[#009e92] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Adding...' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddMedicine;