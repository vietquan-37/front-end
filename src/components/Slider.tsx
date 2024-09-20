"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const slides = [
    {
      id: 1,
      title: "Vibrant Koi Fish Collection",
      description: "Explore our stunning range of colorful Koi fish, handpicked to bring life and serenity to your pond.",
      img: "https://images.pexels.com/photos/2131828/pexels-photo-2131828.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      url: "/",
      bg: "bg-gradient-to-r from-yellow-50 to-pink-50",
    },
    {
      id: 2,
      title: "Exclusive Koi Fish Varieties",
      description: "Discover rare and exotic Koi fish breeds, perfect for collectors and enthusiasts alike.",
      img: "https://images.pexels.com/photos/27076230/pexels-photo-27076230/free-photo-of-n-c-ao-b-i-l-i-ca.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      url: "/",
      bg: "bg-gradient-to-r from-pink-50 to-blue-50",
    },
    {
      id: 3,
      title: "Enhance Your Water Garden",
      description: "Add elegance and tranquility to your water garden with our premium selection of Koi fish.",
      img: "https://images.pexels.com/photos/19012411/pexels-photo-19012411/free-photo-of-tr-ng-h-c-d-ng-v-t-ao-b-i-l-i.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      url: "/",
      bg: "bg-gradient-to-r from-blue-50 to-yellow-50",
    },
  ];
  
  const Slider = () => {
    const [current, setCurrent] = useState(0);

   
  
    return (
      <div className="h-[calc(100vh-80px)] overflow-hidden">
        <div
          className="w-max h-full flex transition-all ease-in-out duration-1000"
          style={{ transform: `translateX(-${current * 100}vw)` }}
        >
          {slides.map((slide) => (
            <div
              className={`${slide.bg} w-screen h-full flex flex-col gap-16 xl:flex-row`}
              key={slide.id}
            >
              {/* TEXT CONTAINER */}
              <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center">
                <h2 className="text-xl lg:text-3xl 2xl:text-5xl">
                  {slide.description}
                </h2>
                <h1 className="text-5xl lg:text-6xl 2xl:text-8xl font-semibold">
                  {slide.title}
                </h1>
                <Link href={slide.url}>
                  <button className="rounded-md bg-black text-white py-3 px-4 ">
                    SHOP NOW
                  </button>
                </Link>
              </div>
              {/* IMAGE CONTAINER */}
              <div className="h-1/2 xl:w-1/2 xl:h-full relative">
                <Image
                  src={slide.img}
                  alt=""
                  fill
                  sizes="100%"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="absolute m-auto left-1/2 bottom-8 flex gap-4">
          {slides.map((slide, index) => (
            <div
              className={`w-3 h-3  rounded-full ring-1 ring-gray-600 cursor-pointer flex items-center justify-center ${
                current === index ? "scale-150" : ""
              }`}
              key={slide.id}
              onClick={() => setCurrent(index)}
            >
              {current === index && (
                <div className="w-[6px] h-[6px] bg-gray-600 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Slider;