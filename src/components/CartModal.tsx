"use client";

import { useEffect, useState } from "react";
import UseAxiosAuth from "@/utils/axiosClient";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

const CartModal = () => {
    const axiosAuth = UseAxiosAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState<number>(0); // State for total price
    const [isModalOpen, setIsModalOpen] = useState(true); // State to control modal visibility
    const router = useRouter(); // Next.js router for navigation

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
                }
            } catch (error) {
                console.error("Failed to fetch cart items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [axiosAuth]);

    const handleRemoveItem = async (id: number) => {
        try {
            const response = await axiosAuth.delete(`/api/Order`, { params: { id } });
            if (response.data.success) {
                setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
                // Optionally, update the totalPrice based on the remaining items
            }
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
        }
    };

    const handleCheckout = () => {
        setIsModalOpen(false); // Close the modal on checkout
        router.push('/user/cart'); // Redirect to the cart page for checkout
    };

    return (
        isModalOpen && (
            <div className="w-max absolute p-6 shadow-lg bg-white top-12 right-0 flex flex-col gap-6 z-20 rounded-lg">
                {loading ? (
                    <div className="flex justify-center items-center py-16 text-gray-500">Loading...</div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center text-lg text-gray-600 py-8">Your cart is empty</div>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-900">Shopping Cart</h2>
                        <div className="flex flex-col gap-8">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 border-b pb-6">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        width={72}
                                        height={96}
                                        className="object-cover rounded-lg shadow-md"
                                    />
                                    <div className="flex flex-col justify-between w-full">
                                        <div>
                                            <div className="flex items-center justify-between gap-4">
                                                <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                                                <span className="text-lg font-semibold text-gray-900">{item.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                                            </div>
                                            <div className="text-sm text-gray-500">{item.categoryName}</div>
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 border-t pt-4">
                            <div className="flex items-center justify-between font-semibold text-lg text-gray-900">
                                <span>Subtotal</span>
                                <span>{totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={handleCheckout}
                                    className="py-3 px-6 bg-black text-white rounded-md hover:bg-gray-800 transition duration-200"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )
    );
};

export default CartModal;
