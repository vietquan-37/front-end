import Add from "@/components/Add"
import ProductImage from "@/components/ProductImage"

const SinglePage = () => {
    return (
        <div className='px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 relative flex flex-col lg:flex-row gap-16'>
            {/* image */}
            <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
                <ProductImage />
            </div>
            {/* text */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <h1 className="text-4xl font-medium">Product Name</h1>
                <p className="text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab architecto, voluptates unde modi quas qui quos,
                    pariatur excepturi eaque culpa vitae quasi aspernatur
                    suscipit expedita repellendus ipsam totam dolor delectus.</p>
                <div className="h-[2px] bg-gray-100"></div>
                <div className="flex items-center gap-4">
                    <h2 className="font-medium text-2xl">40$</h2>
                </div>
                <div className="h-[2px] bg-gray-100"></div>
                <Add />
                <div className="text-sm">
                    <h4 className="font-medium mb-4">Title</h4>
                    <p >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Velit impedit, repellendus assumenda consequuntur voluptatem odit eum ab laborum minima.
                        Rerum odit soluta velit expedita labore voluptatibus in fuga consequuntur deleniti?
                    </p>
                </div>
                <div className="text-sm">
                    <h4 className="font-medium mb-4">Title</h4>
                    <p >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Velit impedit, repellendus assumenda consequuntur voluptatem odit eum ab laborum minima.
                        Rerum odit soluta velit expedita labore voluptatibus in fuga consequuntur deleniti?
                    </p>
                </div>
                <div className="text-sm">
                    <h4 className="font-medium mb-4">Title</h4>
                    <p >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Velit impedit, repellendus assumenda consequuntur voluptatem odit eum ab laborum minima.
                        Rerum odit soluta velit expedita labore voluptatibus in fuga consequuntur deleniti?
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SinglePage
