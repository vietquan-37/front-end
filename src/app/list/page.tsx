"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import Pagination from "@/components/Pagination";
import Image from "next/image";

const ListPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 4; // Số sản phẩm trên mỗi trang
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const fetchProducts = async (page: number) => {
    try {
      const search = name ? `&search=${name}` : "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/koi?page=${page}&pageSize=${pageSize}${search}`
      );
      const data = await response.json();
      setProducts(data.data["list-data"]);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(page); // Gọi API khi trang hoặc tên thay đổi
  }, [page, name]);

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrevious = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 relative">
      <div className="hidden sm:flex bg-pink-50 p-4 flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">Discover Amazing Products Just for You</h1>
          <button className="rounded-3xl bg-quan text-white w-max py-3 px-5 text-sm">Buy Now</button>
        </div>
        <div className="relative w-1/3">
          <Image src="https://images.pexels.com/photos/1936119/pexels-photo-1936119.jpeg" alt="" fill className="object-contain border-pink-50" />
        </div>
      </div>

      <h1 className="mt-12 text-xl font-semibold">Koi Fish For You!</h1>
      <ProductList products={products} />
      <Pagination
        onPrevious={handlePrevious}
        onNext={handleNext}
        currentPage={page}
      />
    </div>
  );
};

export default ListPage;
