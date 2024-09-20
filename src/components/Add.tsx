"use client"
import { useState } from "react"

const Add = () => {
    const [quantity, setQuantity] = useState(1)
    const stock = 10
    const handleQuantity = (type: "i" | "d") => {
        if (type === "d" && quantity > 1) {
            setQuantity(prev => prev - 1)
        }
        if (type === "i" && quantity < stock) {
            setQuantity(prev => prev + 1)
        }
    }
    return (
        <div className='flex flex-col gap-4'>
            <h4 className="font-medium">Choose quantity</h4>
            <div className="flex justify-between">
            <div className="flex items-center gap-4">
                <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
                    <button className="cursor-pointer text-xl" onClick={() => handleQuantity("d")} disabled={quantity === 1}>-</button>
                    {quantity}
                    <button className="cursor-pointer text-xl" onClick={() => handleQuantity("i")} disabled={quantity === stock}>+</button>
                
                    </div>
                {stock < 1 ? (
                    <div className="text-xs">Product is out of stock</div>
                ) : (
                    <div className="text-xs">
                        Only <span className="text-orange-500">{stock} items</span>{" "}
                        left!
                        <br /> {"Don't"} miss it
                    </div>
                )}
                </div>
                
                <button className="w-36 text-sm rounded-3xl ring-1
                  ring-quan text-quan py-2 px-4 hover:bg-quan
                  hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none">Add to Cart</button>
            </div >
        </div >
    )
}

export default Add
