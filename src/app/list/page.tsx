"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import Image from "next/image";

const ListPage = () => {
  const [products, setProducts] = useState([]);
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Add the name query parameter if it exists
        const search = name ? `?search=${name}` : "";
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/koi${search}`);
        const data = await response.json();
        setProducts(data.data["list-data"]);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [name]); // Depend on the name parameter

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 relative'>
      <div className="hidden sm:flex bg-pink-50 p-4 flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">Discover Amazing Products Just for You</h1>
          <button className="rounded-3xl bg-quan text-white w-max py-3 px-5 text-sm">Buy Now</button>
        </div>
        <div className="relative w-1/3">
          <Image src="https://images.pexels.com/photos/1936119/pexels-photo-1936119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt=""
            fill className="object-contain border-pink-50" />
        </div>
      </div>
      <Filter />
      <h1 className="mt-12 text-xl font-semibold">Koi Fish For You!</h1>
      <ProductList products={products} />
    </div>
  );
};

export default ListPage;
