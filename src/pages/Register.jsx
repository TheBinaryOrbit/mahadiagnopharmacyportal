import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import LeftRegisterStep1 from "../components/LeftRegisterStep1";
import LeftRegisterStep2 from "../components/LeftRegisterStep2";
import LeftRegisterStep3 from "../components/LeftRegisterStep3";
import img from '../assets/logo.png';
import vendor from '../assets/vendor.jpg';
import baseUrl from "../utils/baseUrl";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Step 1 data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: ""
    });

    // Step 2 data
    const [addressData, setAddressData] = useState({
        area: "",
        landmark: "",
        pincode: "",
        district: "",
        state: "",
        lat: null,
        lng: null
    });
    const [addressId, setAddressId] = useState(null);

    // Step 3 data
    const [shopData, setShopData] = useState({
        shopName: "",
        shopImage: null
    });

    const handleStep1Submit = () => {
        if (!formData.name || !formData.email || !formData.phoneNumber) {
            toast.error('Please fill all fields');
            return;
        }
        if (!/^\d{10}$/.test(formData.phoneNumber)) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            toast.error('Please enter a valid email');
            return;
        }
        setStep(2);
    };

    const handleStep2Submit = async () => {
        if (!addressData.area || !addressData.pincode || !addressData.district || !addressData.state) {
            toast.error('Please fill all required address fields');
            return;
        }
        if (!/^\d{6}$/.test(addressData.pincode)) {
            toast.error('Please enter a valid 6-digit pincode');
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post(`${baseUrl}/address/addaddress`, {
                area: addressData.area,
                landmark: addressData.landmark,
                pincode: addressData.pincode,
                district: addressData.district,
                state: addressData.state,
                lat: addressData.lat,
                lng: addressData.lng
            });

            if (res.status === 200 || res.status === 201) {
                toast.success('Address saved successfully!');
                setAddressId(res.data.address.id || res.data.id || res.data.id);
                setStep(3);
            } else {
                toast.error('Failed to save address. Please try again.');
            }
        } catch (error) {
            console.error('Error saving address:', error);
            const msg = error?.response?.data?.error || error.message || 'Server error';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalSubmit = async () => {
        if (!shopData.shopName) {
            toast.error('Please enter shop name');
            return;
        }
        if (!addressId) {
            toast.error('Address not saved. Please go back to step 2.');
            return;
        }

        setIsLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phoneNumber', formData.phoneNumber);
            formDataToSend.append('shopName', shopData.shopName);
            formDataToSend.append('addressId', addressId);
            if (shopData.shopImage) {
                formDataToSend.append('image', shopData.shopImage);
            }

            const res = await axios.post(`${baseUrl}/pharmacy/pharmacyvendor/addpharmacyvendor`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 200 || res.status === 201) {
                toast.success('Registration successful! Please login.');
                navigate('/');
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            const msg = error?.response?.data?.error || error.message || 'Server error';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <LeftRegisterStep1
                        formData={formData}
                        setFormData={setFormData}
                        onNext={handleStep1Submit}
                        isLoading={isLoading}
                    />
                );
            case 2:
                return (
                    <LeftRegisterStep2
                        addressData={addressData}
                        setAddressData={setAddressData}
                        onNext={handleStep2Submit}
                        onBack={() => setStep(1)}
                        isLoading={isLoading}
                    />
                );
            case 3:
                return (
                    <LeftRegisterStep3
                        shopData={shopData}
                        setShopData={setShopData}
                        onSubmit={handleFinalSubmit}
                        onBack={() => setStep(2)}
                        isLoading={isLoading}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row">
            {/* LEFT SIDE */}
            <div className="relative flex flex-col justify-start px-6 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10 lg:px-16 lg:w-1/2 xl:w-2/5">
                {/* Logo */}
                <div className="z-50 mt-2 md:mt-4">
                    <img src={img} alt="MahaDiagno Logo" className="w-32 sm:w-40 md:w-44 lg:w-48" />
                </div>

                <div className="z-50">
                    <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-[#0C2E50] leading-relaxed">
                        Register as <br /> MahaDiagno Pharmacy Vendor
                    </h1>

                    <p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#5D5D5D]">
                        Join us and start managing your pharmacy business.
                    </p>

                    {/* Step Indicator */}
                    {/* <div className="flex items-center mt-6 gap-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                        s <= step
                                            ? 'bg-[#009e92] text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                                >
                                    {s}
                                </div>
                                {s < 3 && (
                                    <div
                                        className={`w-12 h-1 ${
                                            s < step ? 'bg-[#009e92]' : 'bg-gray-200'
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div> */}
                </div>

                <div className="z-50 w-full max-w-md mt-6 sm:mt-8">
                    {renderStep()}
                    
                    <div className="mt-4 text-center">
                        <span className="text-sm text-[#5D5D5D]">Already have an account? </span>
                        <span 
                            className="text-sm text-[#009e92] cursor-pointer font-semibold hover:underline"
                            onClick={() => navigate('/')}
                        >
                            Login here
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden lg:flex relative text-white bg-transparent lg:w-1/2 xl:w-3/5">
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        backgroundImage: vendor ? `url(${vendor})` : "",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* Fading Overlay */}
                <div className="absolute inset-0 z-20 bg-gradient-to-b from-[dcf2f6]/90 to-[#009e92]/50" />

                {/* Content */}
                <div className="z-30 flex flex-col justify-end w-full px-8 lg:px-12 xl:px-16 py-10">
                    <div>
                        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold">MahaDiagno</h2>
                        <p className="text-2xl lg:text-3xl xl:text-4xl mt-2">
                            Simplifying Diagnostics, Empowering Healthcare
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
