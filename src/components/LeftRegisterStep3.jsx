import { useState } from "react";

export default function LeftRegisterStep3({ shopData, setShopData, onSubmit, onBack, isLoading }) {
    const [previewImage, setPreviewImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('File size should be less than 5MB');
                return;
            }
            setShopData({ ...shopData, shopImage: file });
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold text-[#009e92]">Shop Details</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Step 3 of 3</p>

            <input
                placeholder="Shop Name"
                type="text"
                value={shopData.shopName}
                onChange={(e) => setShopData({ ...shopData, shopName: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#009e92] text-sm sm:text-base"
            />

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Image (Optional)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#009e92] text-sm"
                />
            </div>

            {previewImage && (
                <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                    <img 
                        src={previewImage} 
                        alt="Shop preview" 
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                </div>
            )}

            <div className="flex gap-3 mt-6">
                <button
                    className="w-1/2 bg-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base cursor-pointer hover:bg-gray-400 transition-colors"
                    onClick={onBack}
                    disabled={isLoading}
                >
                    Back
                </button>
                <button
                    className="w-1/2 bg-[#009e92] text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base cursor-pointer hover:bg-[#018177] transition-colors"
                    onClick={onSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </div>
        </div>
    );
}
