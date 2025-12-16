import { useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

export default function LeftRegisterStep2({ addressData, setAddressData, onNext, onBack, isLoading }) {

    // Get current location
    const getCurrentLocation = () => {
        const toastId = toast.loading('Fetching current location...');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setAddressData({
                        ...addressData,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    toast.success('Location captured successfully!');

                    toast.dismiss(toastId);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    toast.error('Unable to get location. Please enable location services.');
                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser.');
        }
    };

    // Fetch district and state from pincode
    useEffect(() => {

        const fetchPincodeDetails = async () => {
            if (addressData.pincode && addressData.pincode.length === 6) {
                const toastId = toast.loading('Fetching current location...');
                try {
                    const res = await axios.get(`https://api.postalpincode.in/pincode/${addressData.pincode}`);
                    if (res.data && res.data[0] && res.data[0].Status === "Success") {
                        const postOffice = res.data[0].PostOffice[0];
                        setAddressData({
                            ...addressData,
                            district: postOffice.Block || postOffice.District || '',
                            state: postOffice.State || ''
                        });
                        toast.success('District and State fetched successfully!');
                    } else {
                        toast.error('Invalid pincode. Please check and try again.');
                    }
                } catch (error) {
                    console.error('Error fetching pincode details:', error);
                    toast.error('Failed to fetch pincode details.');
                }
                finally {
                    
                    toast.dismiss(toastId);
                }
            }
        };

        fetchPincodeDetails();
    }, [addressData.pincode]);

    return (
        <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold text-[#009e92]">Address Details</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Step 2 of 3</p>

            <input
                placeholder="Area"
                type="text"
                value={addressData.area}
                onChange={(e) => setAddressData({ ...addressData, area: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#009e92] text-sm sm:text-base"
            />

            <input
                placeholder="Landmark (Optional)"
                type="text"
                value={addressData.landmark}
                onChange={(e) => setAddressData({ ...addressData, landmark: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#009e92] text-sm sm:text-base"
            />

            <input
                placeholder="Pincode"
                type="tel"
                maxLength={6}
                value={addressData.pincode}
                onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value.replace(/[^0-9]/g, '') })}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#009e92] text-sm sm:text-base"
            />

            <input
                placeholder="District"
                type="text"
                value={addressData.district}
                onChange={(e) => setAddressData({ ...addressData, district: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 mt-4 border border-gray-300 rounded-lg bg-gray-200 focus:outline-none focus:border-[#009e92] text-sm sm:text-base"
                readOnly
            />

            <input
                placeholder="State"
                type="text"
                value={addressData.state}
                onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 mt-4 border border-gray-300 rounded-lg bg-gray-200 focus:outline-none focus:border-[#009e92] text-sm sm:text-base"
                readOnly
            />

            <button
                className="w-full bg-[#66C9C1] text-white mt-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm cursor-pointer hover:bg-[#4db3ab] transition-colors"
                onClick={getCurrentLocation}
                type="button"
            >
                📍 Get Current Location
            </button>

            {addressData.lat && addressData.lng && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Location: {addressData.lat.toFixed(6)}, {addressData.lng.toFixed(6)}
                </p>
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
                    onClick={onNext}
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Next'}
                </button>
            </div>
        </div>
    );
}
