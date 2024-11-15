"use client";

import UseAxiosAuth from "@/utils/axiosClient";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CartItem {
    id: number;
    categoryName: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

interface OrderDetail {
    id: number;
    price: number;
    quantity: number;
    koi: {
        name: string;
        description: string;
        "category-name": string;
        images: { "image-url": string }[];
    };
}

interface Address {
    id: number;
    province: string;
    district: string;
    street: string;
    ward: string;
}

const UserCart = () => {
    const axiosAuth = UseAxiosAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [isUpdatingAddress, setIsUpdatingAddress] = useState<boolean>(false);
    const [addresses, setAddresses] = useState<Address[]>([]);

    const [addressesLoading, setAddressesLoading] = useState<boolean>(false);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingRemove, setLoadingRemove] = useState<number | null>(null);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    // Fetch cart items on component mount
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axiosAuth.get('/cart');
                if (response.data.success) {
                    const items: CartItem[] = response.data.data["order-details"].map((item: OrderDetail) => ({
                        id: item.id,
                        name: item.koi.name,
                        price: item.price,
                        quantity: item.quantity,
                        categoryName: item.koi["category-name"],
                        imageUrl: item.koi.images[0]?.["image-url"] || ""
                    }));
                    setCartItems(items);
                    setTotalPrice(response.data.data["total-price"]);

                    // Set the selected address if available
                    if (response.data.data.address) {
                        setSelectedAddress({
                            id: response.data.data.address.id,
                            province: response.data.data.address.province,
                            district: response.data.data.address.district,
                            street: response.data.data.address.street,
                            ward: response.data.data.address.ward,
                        });
                        setSelectedAddressId(response.data.data.address.id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch cart items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [axiosAuth]);

    // Handle removing an item from the cart
    const handleRemoveItem = async (id: number) => {
        setLoadingRemove(id);
        try {
            const response = await axiosAuth.delete(`/api/Order/${id}`);
            if (response.data.success) {
                setCartItems((prevItems) => {
                    const updatedItems = prevItems.filter(item => item.id !== id);
                    const newTotalPrice = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);
                    setTotalPrice(newTotalPrice);
                    return updatedItems;
                });
            }
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
        } finally {
            setLoadingRemove(null);
        }
    };

    // Handle PayPal Checkout
    const handlePayPalCheckout = async () => {
        try {
            const payload = {
                addressId: selectedAddressId
            };
            const response = await axiosAuth.post('/api/Payment/create', payload);
            if (response.data.success && response.data.data) {
                window.location.href = response.data.data;
            } else {
                console.error("Failed to initiate PayPal payment:", response.data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error initiating PayPal payment:", error);
        }
    };

    // Handle changing the address
    const handleChangeAddress = async () => {
        setIsUpdatingAddress(true);
        setAddressesLoading(true);
        try {
            const response = await axiosAuth.get('/api/User/Address');
            if (response.data.success) {
                setAddresses(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setAddressesLoading(false);
        }
    };

    // Update the order's address
    const updateOrderAddress = async (addressId: number) => {
        try {
            const response = await axiosAuth.put(`/api/Order/Address/${addressId}`);
            if (response.data.success) {
                // Update the selected address state
                const selected = addresses.find(addr => addr.id === addressId);
                if (selected) {
                    setSelectedAddress(selected);
                    setSelectedAddressId(addressId);
                }
            } else {
                console.error("Failed to update address in order:", response.data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error updating order address:", error);
        }
    };

    // Handle selecting an address from the list
    const handleAddressSelection = async (addressId: number) => {
        await updateOrderAddress(addressId);
        setIsUpdatingAddress(false);
    };

    // Cancel updating the address
    const handleCancelUpdateAddress = () => {
        setIsUpdatingAddress(false);
    };

    return (
        <div className="relative container mx-auto p-6 max-w-lg">
            <h2 className="text-3xl font-extrabold mb-8 text-center">Your Cart</h2>
            {loading ? (
                <div className="text-center text-lg text-gray-500">Loading...</div>
            ) : cartItems.length === 0 ? (
                <div className="text-center text-gray-700 text-lg">Your cart is empty</div>
            ) : (
                <>
                    {/* Cart Items */}
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    width={100}
                                    height={120}
                                    className="object-cover rounded-lg"
                                />
                                <div className="flex flex-col justify-between w-full">
                                    <div>
                                        <h3 className="font-semibold text-xl">{item.name}</h3>
                                        <p className="text-gray-500 text-sm">{item.categoryName}</p>
                                        <p className="text-gray-700 text-sm mt-1">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-lg font-semibold text-gray-900">
                                            {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </span>

                                        <button
                                            className={`text-red-500 hover:text-red-600 font-medium ${loadingRemove === item.id ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={loadingRemove === item.id}
                                        >
                                            {loadingRemove === item.id ? "Removing..." : "Remove"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected Address */}
                    <div className="mt-8">
                        {selectedAddress ? (
                            <div className="border p-4 rounded-lg bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-700 mb-2">Delivery Address</h3>
                                <p className="text-gray-800">{selectedAddress.street}, {selectedAddress.ward}</p>
                                <p className="text-gray-600">{selectedAddress.district}, {selectedAddress.province}</p>
                                <button
                                    onClick={handleChangeAddress}
                                    className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Change Address
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Select Delivery Address</h3>
                                <button
                                    onClick={handleChangeAddress}
                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                                >
                                    Select Address
                                </button>
                            </div>
                        )}

                        {/* Address Selection UI */}
                        {isUpdatingAddress && (
                            <div className="mt-4">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Choose a Delivery Address</h3>
                                {addressesLoading ? (
                                    <div className="text-center text-gray-500">Loading addresses...</div>
                                ) : !addresses || addresses.length === 0 ? (
                                    <div className="text-center text-gray-700">No addresses found. Please add an address.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {addresses.map((address) => (
                                            <div
                                                key={address.id}
                                                className={`p-4 border rounded-lg cursor-pointer transition ${selectedAddressId === address.id ? "border-blue-500 bg-blue-50" : "border-gray-300"
                                                    }`}
                                                onClick={() => handleAddressSelection(address.id)}
                                            >
                                                <p className="text-gray-800 font-medium">{address.street}, {address.ward}</p>
                                                <p className="text-gray-600">{address.district}, {address.province}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={handleCancelUpdateAddress}
                                    className="mt-4 text-gray-600 hover:text-gray-800 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Total Price and Checkout */}
                    <div className="border-t mt-8 pt-4">
                        <div className="flex justify-between font-semibold text-xl mb-4 text-gray-800">
                            <span>Total:</span>
                            <span>{totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                        </div>
                        <button
                            onClick={handlePayPalCheckout}
                            className="bg-blue-600 text-white py-3 px-6 rounded-lg w-full font-semibold hover:bg-blue-700 transition transform hover:-translate-y-0.5 focus:ring-2 focus:ring-blue-500"
                            disabled={!selectedAddressId}
                        >
                            Checkout with PayPal
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserCart;


