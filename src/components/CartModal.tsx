"use client";

import UseAxiosAuth from "@/utils/axiosClient";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CartItem {
    id: number; // or string, depending on your API
    categoryName: string; // Adjust according to your data
    price: number;
    quantity: number;
}

interface OrderDetail {
    id: number;
    price: number;
    quantity: number;
    'category-name': string; 
}

const CartModal = () => {
    const axiosAuth = UseAxiosAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axiosAuth.get('/cart'); // Update with your endpoint
                if (response.data.success) {
                    const items: CartItem[] = response.data.data['order-details'].map((item: OrderDetail) => ({
                        id: item.id,
                        price: item.price,
                        quantity: item.quantity,
                        categoryName: item['category-name'] // Map the API property to the interface property
                    }));
                    setCartItems(items);
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
            const response = await axiosAuth.delete(`/api/Order`, { params: { id } }); // Use query parameter for id
            if (response.data.success) {
                setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
        }
    };
    
    return (
        <div className='w-max absolute p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20'>
            {loading ? (
                <div className="">Loading...</div>
            ) : cartItems.length === 0 ? (
                <div className="">Cart is Empty</div>
            ) : (
                <>
                    <h2 className="text-xl">Shopping Cart</h2>
                    <div className="flex flex-col gap-8">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <Image 
                                    src="https://images.pexels.com/photos/28271602/pexels-photo-28271602/free-photo-of-g-t-i-m-u-k-t-c-u.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                                    alt="" 
                                    width={72} 
                                    height={96} 
                                    className="object-cover rounded-md" 
                                />
                                <div className="flex flex-col justify-between w-full">
                                    <div className="">
                                        <div className="flex items-center justify-between gap-8">
                                            <h3 className="font-semibold">{item.categoryName}</h3>
                                            <div className="p-1 bg-gray-50 rounded-sm">${item.price}</div>
                                        </div>
                                        <div className="text-sm text-gray-500">Available</div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Qty. {item.quantity}</span>
                                        <span className="text-blue-500 cursor-pointer" onClick={() => handleRemoveItem(item.id)}>Remove</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="">
                        <div className="flex items-center justify-between font-semibold">
                            <span className="">Subtotal</span>
                            <span className="">${cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-2 mb-4">
                            Lorem ipsum dolor sit amet consectetur
                        </p>
                        <div className="flex justify-between text-sm">
                            <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">View Cart</button>
                            <button className="rounded-md py-3 px-4 bg-black text-white">Checkout</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartModal;
