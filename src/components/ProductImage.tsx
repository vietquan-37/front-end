"use client"
import Image from "next/image"
import { useState } from "react"
const images = [
    {
        id: 1,
        url: "https://images.pexels.com/photos/10211121/pexels-photo-10211121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 2,
        url: "https://images.pexels.com/photos/12245117/pexels-photo-12245117.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 3,
        url: "https://images.pexels.com/photos/18487178/pexels-photo-18487178/free-photo-of-n-c-ao-b-i-l-i-ca.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 4,
        url: "https://images.pexels.com/photos/18336355/pexels-photo-18336355/free-photo-of-trai-cam-ao-b-i-l-i-ca.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
    },
]
const ProductImage = () => {
    const [index, setIndex] = useState(0)
    return (
        <div className=''>
            <div className="h-[500px] relative">
                <Image src={images[index].url}
                    alt=""
                    fill
                    className="object-cover rounded-md"
                    sizes="50vw"
                />


            </div>
            <div className="flex justify-between gap-4 mt-8 cursor-pointer">

                {images.map((img,i) => (
                    <div className="w-1/4 h-32 relative gap-4 mt-8 " key={img.id} onClick={()=>setIndex(i)}>
                        <Image src={img.url}
                            alt=""
                            fill
                            className="object-cover rounded-md"
                            sizes="30vw"
                        />
                    </div>
                ))}


            </div>
        </div>
    )
}

export default ProductImage