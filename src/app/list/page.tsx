import Filter from "@/components/Filter"
import ProductList from "@/components/ProductList"
import Image from "next/image"

const ListPage = () => {
  return (
    <div className='px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 relative'>
      <div className=" hidden sm:flex bg-pink-50 p-4 flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
        <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">Discover Amazing Products Just for You</h1>
        <button className="rounded-3xl bg-quan text-white w-max py-3 px-5 text-sm">Buy Now</button>
        </div>
        <div className="relative w-1/3">
          <Image src="https://images.pexels.com/photos/1936119/pexels-photo-1936119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt=""
            fill className="object-contain border-pink-50" />
        </div>
      </div>
      <Filter/>
      <h1 className="mt-12 text-xl font-semibold">Koi Fish For You!</h1>
      <ProductList/>
    </div>
  )
}

export default ListPage