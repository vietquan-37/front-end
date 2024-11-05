"use client";
import { useState } from "react";
import useAxiosAuth from "@/utils/axiosClient";

type AddProps = {
    stock: number;
    "koi-id": number;
    productName: string;
};

const Add = ({ stock, "koi-id": koiId, productName }: AddProps) => {
    const axiosAuth = useAxiosAuth();
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleQuantity = (type: "i" | "d") => {
        if (type === "d" && quantity > 1) {
            setQuantity((prev) => prev - 1);
        } else if (type === "i" && quantity < stock) {
            setQuantity((prev) => prev + 1);
        }
    };

    const addToCart = async () => {
        setLoading(true);
        setError(null);
    
        // Log the quantity and koiId before the API call
        console.log('Adding to cart:', { quantity, koiId });
    
        try {
            const response = await axiosAuth.post(`/api/Order/addtocart`, { quantity, "koi-id": koiId });
            console.log('API response:', response.data);
    
            if (response.data && response.data.success) {
                alert(`Product ${productName} added to cart!`);
            } else {
                const errorMessage = response.data?.message || "Product is already in cart.";
                setError(errorMessage);
            }
        } catch (error: any) {
            console.error(`Failed to add product ${koiId} to cart:`, error);
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="flex flex-col gap-4">
            <h4 className="font-medium">Choose quantity</h4>
            <div className="flex justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
                        <button
                            className="cursor-pointer text-xl"
                            onClick={() => handleQuantity("d")}
                            disabled={quantity === 1}
                        >
                            -
                        </button>
                        {quantity}
                        <button
                            className="cursor-pointer text-xl"
                            onClick={() => handleQuantity("i")}
                            disabled={quantity === stock}
                        >
                            +
                        </button>
                    </div>
                    {stock < 1 ? (
                        <div className="text-xs">Product is out of stock</div>
                    ) : (
                        <div className="text-xs">
                            Only <span className="text-orange-500">{stock} items</span> left!
                            <br /> Don't miss it
                        </div>
                    )}
                </div>

                <button
                    className="w-36 text-sm rounded-3xl ring-1 ring-quan text-quan py-2 px-4 hover:bg-quan hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none flex items-center justify-center"
                    onClick={addToCart}
                    disabled={stock < 1 || loading}
                >
                    {loading ? (
                        <span className="animate-spin h-4 w-4 border-t-2 border-quan border-opacity-50 rounded-full"></span>
                    ) : (
                        "Add to Cart"
                    )}
                </button>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>} {/* Display error message */}
        </div>
    );
};

export default Add;
