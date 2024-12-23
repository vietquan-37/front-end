"use client";
import useAxiosAuth from "@/utils/axiosClient";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Product = {
  id: number;
  "image-urls": string[];
  "name-product": string;
  price: number;
  "description-product": string;
  size: number;
  quantity: number; // Add quantity to track stock
};

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const axiosAuth = useAxiosAuth();
  const [error, setError] = useState<{ [key: number]: string | null }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

  const addToCart = async (product: Product) => {
    setLoading((prev) => ({ ...prev, [product.id]: true }));
    try {
      const response = await axiosAuth.post(`/api/Order/addtocart`, {
        quantity: 1,
        "koi-id": product.id,
      });

      console.log(`Response from server:`, response.data);

      if (response.data && response.data.success) {
        alert(`Product ${product["name-product"]} added to cart!`);
        setError((prev) => ({ ...prev, [product.id]: null }));
      } else {
        const errorMessage = response.data?.message || "Product is already in cart";
        alert(`Failed to add to cart: ${errorMessage}`);
        setError((prev) => ({ ...prev, [product.id]: errorMessage }));
      }
    } catch (error: any) {
      console.error(`Failed to add product ${product.id} to cart:`, error);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      alert(`Error: ${errorMessage}`);
      setError((prev) => ({ ...prev, [product.id]: errorMessage }));
    } finally {
      setLoading((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {products.map((product) => (
        <div key={product.id} className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]">
          <Link href={`/single?id=${product.id}`} className="relative w-full h-80">
            <Image
              src={product["image-urls"][0]}
              alt={product["name-product"]}
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
            />
            <Image
              src={product["image-urls"][1]}
              alt={product["name-product"]}
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md"
            />
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold">{product["name-product"]}</span>
              <span className="font-medium ml-2">
  {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
</span>

            </div>
            <button
              className="rounded-2xl ring-1 ring-quan text-quan py-2 px-4 text-xs hover:bg-quan hover:text-white flex items-center justify-center w-24"
              onClick={() => addToCart(product)}
              disabled={loading[product.id] || product.quantity === 0} // Disable if loading or quantity is 0
            >
              {loading[product.id] ? (
                <span className="animate-spin h-4 w-4 border-t-2 border-quan border-opacity-50 rounded-full"></span>
              ) : (
                "Add to cart"
              )}
            </button>
          </div>
          <div className="text-sm text-gray-500">{product["description-product"]}</div>
          <div className="text-sm text-gray-500">Size: {product.size} cm</div>
          {error[product.id] && <p className="text-red-500 text-xs">{error[product.id]}</p>}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
