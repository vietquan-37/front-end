const Filter = () => {
    return (
        <div className='m-12 flex justify-between flex-wrap'>
            <div className="flex gap-6">
                <select name="size" className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
                    {[...Array(81)].map((_, i) => (
                        <option key={i} value={`${i + 20} cm`}>
                            {i + 20} cm
                        </option>
                    ))}
                </select>
                <input type="text" name="min" placeholder="min price" className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"></input>
                <input type="text" name="max" placeholder="max price" className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"></input>
                <select className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]">
                    <option>All Filter</option>
                </select>
            </div>
            <div className="">
                <select name="" className="py-2 px-2 rounded-2xl text-xs font-medium bg-[#EBEDED]">
                    <option>SortBy</option>
                    <option>Price(low to high)</option>
                    <option>Price(high to low)</option>
                    <option>Newest</option>
                    <option>Oldest</option>
                </select>
            </div>
        </div>
    )
}

export default Filter
