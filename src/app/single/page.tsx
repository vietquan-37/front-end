"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import Add from "@/components/Add";

type Product = {
  id: number;
  name: string;
  images: { "image-url": string }[];
  "category-name": string;
  price: number;
  description: string;
  quantity: number;
  dob: string;
  size: number;
};

const SinglePage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return; // Ensure ID is available
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/koi/get/${id}`);
        const data = await response.json();
        setProduct(data.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const imageUrls = product.images.map((img) => img["image-url"]);
  
  // Convert id to number, use 0 as a fallback if id is null
  const koiId = id ? parseInt(id) : 0;

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImage images={imageUrls} />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product["category-name"]}</h1>
        <p className="text-gray-500">{product.description}</p>
        <div className="h-[2px] bg-gray-100"></div>
        <div className="flex items-center gap-4">
          <h2 className="font-medium text-2xl">{product.price.toLocaleString()} VNĐ</h2>
        </div>
        <div className="h-[2px] bg-gray-100"></div>
        <p className="text-gray-500">Date of Birth: {new Date(product.dob).toLocaleDateString()}</p>
        <p className="text-gray-500">Size: {product.size}</p>
        <div className="h-[2px] bg-gray-100"></div>
        <Add stock={product.quantity} koi-id={koiId} productName={product.name} /> {/* Use koiId here */}
      </div>
    </div>
  );
};

export default SinglePage;
