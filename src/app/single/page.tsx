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

type Review = {
  id: number;
  comment: string;
  rating: number;
  "order-detail-id": number;
  "koi-name": string;
};

const SinglePage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
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

  useEffect(() => {
    const fetchReview = async () => {
      if (!id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Review/koi/${id}`);
        const data = await response.json();
        setReview(data.data);
      } catch (error) {
        console.error("Failed to fetch review:", error);
      }
    };

    if (product) {
      fetchReview();
    }
  }, [id, product]);

  if (!product) return <p>Loading...</p>;

  const imageUrls = product.images.map((img) => img["image-url"]);
  const koiId = id ? parseInt(id) : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-xl ${index < rating ? "text-yellow-400" : "text-gray-300"}`}>
        ★
      </span>
    ));
  };

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
          <h2 className="font-medium text-2xl">
            {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </h2>
        </div>
        <div className="h-[2px] bg-gray-100"></div>
        <p className="text-gray-500">Date of Birth: {new Date(product.dob).toLocaleDateString()}</p>
        <p className="text-gray-500">Size: {product.size}</p>
        <div className="h-[2px] bg-gray-100"></div>
        <Add stock={product.quantity} koi-id={koiId} productName={product.name} />

        {/* Display Review */}
        {review ? (
          <div className="mt-6 p-6 border border-gray-200 rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Customer Review</h3>
            <div className="flex items-center mb-3">
              <div className="flex">{renderStars(review.rating)}</div>
              <span className="ml-2 text-gray-600">{review.rating} / 5</span>
            </div>
            <p className="text-gray-700 font-medium">"{review.comment}"</p>
            <p className="mt-3 text-gray-500 text-sm">Reviewed by: {review["koi-name"]}</p>
          </div>
        ) : (
          <p className="text-gray-500 mt-6">No reviews available</p>
        )}
      </div>
    </div>
  );  
};

export default SinglePage;
