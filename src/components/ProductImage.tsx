"use client";
import Image from "next/image";
import { useState } from "react";

type ProductImageProps = {
  images: string[] | undefined;
};

const ProductImage: React.FC<ProductImageProps> = ({ images }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <div>
      <div className="h-[500px] w-full relative">
        <Image 
          src={images[index]} 
          alt="" 
          fill 
          className="object-contain rounded-md" 
          sizes="50vw" 
        />
      </div>
      <div className="flex gap-4 mt-8 cursor-pointer justify-center">
        {images.map((url, i) => (
          <div 
            className="w-1/4 h-24 relative" 
            key={i} 
            onClick={() => setIndex(i)}
          >
            <Image 
              src={url} 
              alt="" 
              fill 
              className="object-contain rounded-md" 
              sizes="20vw" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImage;
