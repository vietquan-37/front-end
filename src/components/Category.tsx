"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

// Define a type for the category
interface Category {
  name: string;
}

// List of valid image URLs to use as random images
const imageUrls = [
  "https://images.pexels.com/photos/1054022/pexels-photo-1054022.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/325045/pexels-photo-325045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/2067508/pexels-photo-2067508.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1699204/pexels-photo-1699204.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/979729/pexels-photo-979729.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2803523/pexels-photo-2803523.jpeg?auto=compress&cs=tinysrgb&w=600"
];

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Category`);
        const data = await response.json();
        setCategories(data.data); // Set the categories from the response
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative px-4">
      <button onClick={scrollLeft} className="absolute left-0 z-10 bg-gray-300 p-2 rounded-full">◀</button>
      <button onClick={scrollRight} className="absolute right-0 z-10 bg-gray-300 p-2 rounded-full">▶</button>
      <div
        ref={sliderRef}
        className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {categories.map((category, index) => {
          // Select a random image URL from the list for each category
          const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];

          return (
            <Link 
              href={`/list?cat=${category.name}`} 
              key={index} 
              className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6" 
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative bg-slate-100 w-full h-96">
                <Image
                  src={randomImageUrl}
                  alt={category.name}
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </div>
              <h1 className="mt-4 font-semibold tracking-wide text-gray-800 text-lg text-center capitalize">
                {category.name}
              </h1>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
