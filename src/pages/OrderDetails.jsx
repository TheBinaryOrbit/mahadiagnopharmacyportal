import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapPin, Calendar, User, Phone, Package, Trash2, Wallet, Building2, Mail, Pill } from 'lucide-react';
import baseUrl from '../utils/baseUrl';
import imageBaseUrl from '../utils/imageBaseUrl';

const OrderDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/pharmacy/order/orders/${id}`);
            setOrder(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to load order details. Please try again.');
            toast.error('Failed to load order details');
            console.error('Error fetching order details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async () => {
        if (!deleteConfirm) {
            setDeleteConfirm(true);
            return;
        }

        try {
            toast.info('Deleting order...', { autoClose: false, toastId: 'deleting' });

            const res = await axios.delete(`${baseUrl}/pharmacy/order/orders/${id}`);
            if (res.status == 200) {
                toast.dismiss('deleting');
                toast.success('Order deleted successfully');
                navigate(-1);
            }
            else {
                toast.error('Failed to delete order');
            }
        } catch (err) {
            toast.dismiss('deleting');
            toast.error('Failed to delete order. Please try again.');
            console.error('Error deleting order:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg font-medium">Loading order details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Order Found</h3>
                <p className="text-gray-600">The requested order could not be found.</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toFixed(2)}`;
    };

    const getUserFullName = (user) => {
        if (!user) return 'N/A';
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        return `${firstName} ${lastName}`.trim() || 'N/A';
    };

    const handleUpdateStatus = async (status) => {
        try {
            const res = await axios.patch(`${baseUrl}/pharmacy/order/orders/${id}/status`, {
                orderstatus: status
            });

            if (res.status == 200) {
                toast.success("Order status changed successfully");
                fetchOrderDetails();
            }
            else {
                toast.error("Unable to change the status")
            }
        } catch (error) {
            console.log(error);
            toast.error("Unable to change the status")
        }
    }

    const handleMarkAsPaid = async (paidStatus) => {
        if (paidStatus == 'false') return toast.info("Already marked as not paid")

        try {
            const res = await axios.patch(`${baseUrl}/pharmacy/order/orders/${id}`, {
                isPaid: paidStatus === 'true'
            });

            if (res.status == 200) {
                toast.success("Payment status updated");
                fetchOrderDetails();
            }
            else {
                toast.error("Unable to change the payment status")
            }
        } catch (error) {
            console.log(error);
            toast.error("Unable to change the payment status")
        }
    }

    return (
        <div className="container mx-auto w-full ">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            {/* <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold">Order ID: #{order.id}</h1>
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="flex justify-between items-center text-lg font-semibold">
                            <span>Order Information</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                order.orderstatus === 'PLACED' ? 'bg-yellow-100 text-yellow-800' :
                                order.orderstatus === 'DISPATCHED' ? 'bg-blue-100 text-blue-800' :
                                order.orderstatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {order.orderstatus}
                            </span>
                        </h3>
                    </div>
                    <div className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-500">Customer Name</label>
                                <p className="font-medium">{getUserFullName(order.user)}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Phone Number</label>
                                <p className="font-medium">{order.user?.phoneNumber || 'N/A'}</p>
                            </div>
                            {order.user?.email && (
                                <div>
                                    <label className="text-sm text-gray-500">Email</label>
                                    <p className="font-medium">{order.user.email}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm text-gray-500">Total Amount</label>
                                <p className="font-semibold text-lg text-green-600">{formatCurrency(order.totalAmount || 0)}</p>
                            </div>
                        </div>

                        <hr className="my-4 border-gray-200" />

                        <div className="mt-4">
                            <label className="text-sm text-gray-500">Pharmacy Vendor Details</label>
                            <div className="bg-gray-50 p-3 rounded-lg mt-2">
                                <div className="flex items-center mb-2">
                                    <Building2 className="h-4 w-4 mr-2 text-gray-600" />
                                    <p className="font-medium">{order.pharmacyVendor?.shopName || 'N/A'}</p>
                                    {order.pharmacyVendor?.isVerified && (
                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            Verified
                                        </span>
                                    )}
                                    {order.pharmacyVendor?.isActive && (
                                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                            Active
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center mb-1">
                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                    <p className="text-sm text-gray-600">{order.pharmacyVendor?.name || 'N/A'}</p>
                                </div>
                                <div className="flex items-center mb-1">
                                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                    <p className="text-sm text-gray-600">{order.pharmacyVendor?.email || 'N/A'}</p>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                    <p className="text-sm text-gray-600">{order.pharmacyVendor?.phoneNumber || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <hr className="my-4 border-gray-200" />

                        <div className="mt-4">
                            <label className="text-sm text-gray-500 mb-3 block">Order Items ({order.orderItem?.length || 0})</label>
                            <div className="space-y-3">
                                {order.orderItem?.map((item) => (
                                    <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex gap-4">
                                            <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                                                {item.medicine?.imageUrl ? (
                                                    <img
                                                        src={`${imageBaseUrl}/${item.medicine.imageUrl}`}
                                                        alt={item.medicine?.name || 'Medicine'}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                        <Pill className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-base">{item.medicine?.name || 'Unknown Medicine'}</h4>
                                                <p className="text-sm text-gray-600">Brand: {item.medicine?.brand || 'N/A'}</p>
                                                <p className="text-sm text-gray-500">{item.medicine?.quantityDescription || ''}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm text-gray-600">Qty: <span className="font-medium">{item.quantity || 0}</span></span>
                                                        <span className="text-sm text-gray-600">Price: <span className="font-medium">{formatCurrency(item.medicine?.finalPrice || 0)}</span></span>
                                                    </div>
                                                    <p className="font-semibold text-green-600">
                                                        {formatCurrency((item.quantity || 0) * (item.medicine?.finalPrice || 0))}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="my-4 border-gray-200" />

                        <div className="mt-4">
                            <label className="text-sm text-gray-500">Payment Information</label>
                            <div className="bg-gray-50 p-3 rounded-lg mt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <Wallet className="h-4 w-4 mr-2 text-gray-400" />
                                        <p className="text-sm text-gray-600">Payment Method: <span className="font-medium capitalize">{order.modeOfPayment || 'N/A'}</span></p>
                                    </div>
                                    {/* <span className={`px-3 py-1 rounded-full text-sm ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {order.isPaid ? 'Paid' : 'Unpaid'}
                                    </span> */}
                                </div>
                                {order.razorpayOrderId && (
                                    <div className="text-xs text-gray-500 space-y-1 mt-2">
                                        <p>Razorpay Order ID: {order.razorpayOrderId}</p>
                                        {order.razorpayPaymentId && <p>Payment ID: {order.razorpayPaymentId}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="my-4 border-gray-200" />

                        {order.address && (
                            <>
                                <div className="mt-4">
                                    <label className="text-sm text-gray-500">Delivery Address</label>
                                    <div className="flex items-start mt-1">
                                        <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-1" />
                                        <p>
                                            {order.address?.area || ''}, {order.address?.landmark || ''},
                                            {order.address?.district || ''}, {order.address?.state || ''} - {order.address?.pincode || ''}
                                        </p>
                                    </div>
                                </div>
                                <hr className="my-4 border-gray-200" />
                            </>
                        )}

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-500">Order Placed</label>
                                <div className="flex items-center mt-1">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    <p className="text-sm">{formatDate(order.createdAt)}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Last Updated</label>
                                <div className="flex items-center mt-1">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    <p className="text-sm">{formatDate(order.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold">Actions</h3>
                    </div>
                    <div className="px-6 py-4 space-y-4">
                        {!order.isPaid && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Payment Mode</label>
                                <div
                                    className='w-full py-2 px-3 pr-10 font-semibold border border-slate-300 rounded-md' 
                                    
                                >
                                    {
                                        order.modeOfPayment === 'cash' ? 'Cash on Delivery' : 'Online Payment Razorpay'
                                        
                                    }
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2">Order Status</label>
                            <select 
                                className='w-full h-10 px-3 pr-10 font-semibold border border-slate-300 rounded-md' 
                                onChange={(e) => handleUpdateStatus(e.target.value)} 
                                value={order.orderstatus}
                            >
                                <option value="PLACED">Mark as Placed</option>
                                <option value="DISPATCHED">Mark as Dispatched</option>
                                <option value="DELIVERED">Mark as Delivered</option>
                                <option value="CANCELLED">Mark as Cancelled</option>
                            </select>
                        </div>

                        {order.address && (
                            <>
                                <hr className="border-gray-200" />
                                <a href={`https://maps.google.com/?q=${order.address?.lat},${order.address?.lng}`} target='_blank' rel="noopener noreferrer">
                                    <button
                                        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center cursor-pointer transition-colors"
                                    >
                                        <MapPin className="h-4 w-4 mr-2" />
                                        View on Map
                                    </button>
                                </a>
                            </>
                        )}

                        <hr className="border-gray-200" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
