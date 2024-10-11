"use client";
import Layout from "@/app/admin/layoutAdmin";
import "@/app/admin/style/ellipsis.css";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  "name-product": string;
  dob: Date;
  "description-product":string;
  price: number;
  quantity: number;
  "category-id": number;
  size: number;
  imageUrls:string[] | null;
}
export default function Products() 
{
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sort, setSort] = useState(""); // Default sort
  //API cGetAllProductAdmin
const fetchProducts = async (page = 1, size = pageSize, searchTerm = "", sort = "") => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_API}/api/koi`);
    url.searchParams.append("page", String(page));
    url.searchParams.append("pageSize", String(size));

    if (searchTerm) url.searchParams.append("search", searchTerm);
    if (sort) url.searchParams.append("sort", sort);

    const response = await fetch(url.toString());
    const data = await response.json();
    
    setProducts(data.data["list-data"]);
    setTotalPages(data.data["total-page"]);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
   // fetch first 
   useEffect(() => {
    fetchProducts(currentPage, pageSize, "", ""); // default
  }, []);

  // call again when 1 change
  useEffect(() => {
    fetchProducts(currentPage, pageSize, searchTerm, sort);
  }, [currentPage, pageSize, searchTerm, sort]);

 // sort
 const handleFilterChange = (value: string) => {
  switch (value) {
    case "price":
      setSort("price");
      break;
    case "quantity":
      setSort("quantity");
      break;
    case "name":
        setSort("name");
        break;  
    default:
      setSort("");
      break;
  }
};
// method imageUrls
const getRandomImage = (imageUrls: string[] | null): string | undefined => {
  if (imageUrls && imageUrls.length > 0) {
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    return imageUrls[randomIndex];
  }
  return undefined; // undefined
};

return (
  <Layout>
    <div className="p-4">
      <h2 className="text-blue-900 text-2xl mb-4">Danh sách sản phẩm</h2>

      {/* Ô tìm kiếm và bộ lọc */}
      <div className="flex flex-col md:flex-row md:justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/5 mr-0 md:mr-4 mb-2 md:mb-0"
        />

        <select
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border p-2 rounded w-full md:w-1/6"
        >
          <option value="">Tất cả</option>
          <option value="name">OrderBy Name</option>
          <option value="price">OrderBy Price</option>
          <option value="quantity">OrderBy Quantity</option>
        </select>
      </div>
      {/* Tiêu đề */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-10 gap-4 font-semibold mb-4">
        <span>ID</span>
        <span>Name</span>
        <span>Date Of Birth</span>
        <span>Description</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Category</span>
        <span>Size</span>
        <span>Images</span>
      </div>

      {/* Danh sách sản phẩm */}
      <ul className="bg-white rounded-lg shadow-md">
        {products.length > 0 ? (
          products.map((product) => (
            <li
              key={product.id}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 p-4 border-b hover:bg-gray-100 transition duration-300"
            >
              <span>{product.id}</span>
              <span className="ellipsis">{product["name-product"]}</span>
              <span className="ellipsis">
                  {product.dob ? new Date(product.dob).toLocaleDateString() : "N/A"}
              </span>
              <span className="ellipsis">{product["description-product"]}</span>
              <span className="ellipsis">{product.price}</span>
              <span className="ellipsis">{product.quantity || "N/A"}</span>
              <span className="ellipsis">{product["category-id"]}</span>
              <span className="ellipsis">{product.size}</span>
               {/* Hiển thị một ảnh ngẫu nhiên */}
               <span className="ellipsis">
                  {getRandomImage(product.imageUrls) ? (
                    <img
                      src={getRandomImage(product.imageUrls)}
                      alt={product["name-product"]}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    "No Image"
                  )}
                </span>
                 {/* Thêm nút Details, Update, Delete */}
        <span className="flex space-x-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => alert(`Details for ${product["name-product"]}`)} // Thay thế bằng logic chi tiết
          >
            Details
          </button>
          <button
            className="bg-yellow-500 text-white px-2 py-1 rounded"
            onClick={() => alert(`Update ${product["name-product"]}`)} // Thay thế bằng logic cập nhật
          >
            Update
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => alert(`Delete ${product["name-product"]}`)} // Thay thế bằng logic xóa
          >
            Delete
          </button>
        </span>    
              {/* <span className="ellipsis">{product.status === "available" ? "Available" : "Out of Stock"}</span> */}
            </li>
          ))
        ) : (
          <li className="p-4 text-gray-600">Không có sản phẩm nào phù hợp.</li>
        )}
      </ul>

      {/* Phân trang */}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`border p-2 mx-1 ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'
            } transition duration-300`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  </Layout>
);
}