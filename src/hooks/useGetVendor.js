import { useState, useEffect } from 'react';

export const useGetVendor = () => {
    const [vendor, setVendor] = useState(null);

    useEffect(() => {
        try {
            const vendorData = localStorage.getItem('vendor');
            if (vendorData) {
                setVendor(JSON.parse(vendorData));
            }
        } catch (error) {
            console.error('Error fetching vendor data:', error);
        }
    }, []);

    return vendor;
};
