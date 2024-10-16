"use client";
import Layout from "@/app/admin/layoutAdmin";
import "@/app/admin/style/ellipsis.css";
import React, { useEffect, useState } from "react";
import Modal from "@/app/admin/products/Modal";
import ImageModal  from "@/app/admin/products/ViewImage"; // Import modal mới
interface Product {
  id: number;
  "name-product": string;
  dob: Date;
  "description-product":string;
  price: number;
  quantity: number;
  "category-id": number;
  size: number;
  "image-urls":string[] | null;
}
// Hard-code danh sách tên danh mục dựa trên ID
const categoryNames: { [key: number]: string } = {
  1: "Asagi",
  2: "Goshiki",
  3: "Kohaku",
  4: "Shusui",
  5: "Koromo",
  6: "Bekko",
  7: "Doitsu",
  8: "Tancho",
  9: "Ginrin",
  10: "Showa",
};

export default function Products() 
{
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sort, setSort] = useState(""); // Default sort
  const [showModal, setShowModal] = useState(false);
  // Bổ sung state để quản lý modal hình ảnh
const [showImageModal, setShowImageModal] = useState(false);
const [selectedImages, setSelectedImages] = useState<string[]>([]); // Danh sách ảnh đã chọn
const [selectedKoiId, setSelectedKoiId] = useState<number | null>(null); // Khai báo state cho koiId

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
// Thêm hàm để mở modal với hình ảnh của sản phẩm
const handleViewImages = (imageUrls: string[] | null, koiId: number) => {
  setSelectedImages(imageUrls || []);
  setSelectedKoiId(koiId); // Lưu koiId để upload ảnh cho đúng sản phẩm
  setShowImageModal(true);
};




const handleAddProduct = (newProduct: any) => {
  // Gửi request thêm sản phẩm mới vào API ở đây

  console.log("New Product:", newProduct);
  // fetchProducts(currentPage, pageSize, searchTerm, sort); // Cập nhật danh sách sản phẩm
};
// Function to get a random image from an array of image URLs
const getRandomImage = (imageUrls: string | any[] | null) => {
  if (imageUrls && imageUrls.length > 0) {
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    const selectedImage = imageUrls[randomIndex];
    return selectedImage;
  } else {
    return "no image";
  }
};
// Hàm định dạng giá trị VND
const formatCurrency = (amount: number) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
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
        <button
          className="create button"
        onClick={() => setShowModal(true)}>Create New Product</button>
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
        <span>Actions</span>
      </div>

      {/* Danh sách sản phẩm */}
      <ul className="bg-white rounded-lg shadow-md">
        {products.length > 0 ? (
          products.map((product) => {
            const randomImage = getRandomImage(product["image-urls"]);
            return (
              <li
                key={product.id}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-10 gap-4 p-4 border-b hover:bg-gray-100 transition duration-300"
              >
                <span>{product.id}</span>
                <span className="ellipsis">{product["name-product"]}</span>
                <span className="ellipsis">
                  {product.dob ? new Date(product.dob).toLocaleDateString() : "N/A"}
                </span>
                <span className="ellipsis">{product["description-product"] || "Chưa có mô tả"}</span>
                <span className="ellipsis">{formatCurrency(product.price)}</span>
                <span className="ellipsis">{product.quantity || "N/A"}</span>
                <span className="ellipsis">{categoryNames[product["category-id"]] || "N/A"}</span>
                <span className="ellipsis">{product.size} cm</span>
                <span className="flex justify-center">
                <button className="view button" onClick={() => handleViewImages(product["image-urls"], product.id)}>
  View Image
</button>

              </span>

                {/* Thêm nút Details, Update, Delete */}
                <span className="flex justify-center space-x-2">
                  <button
                    className="details button"
                    onClick={() => alert(`Details for ${product["name-product"]}`)}
                  >
                    Details
                  </button>
                  <button
                    className="update button"
                    onClick={() => alert(`Update ${product["name-product"]}`)}
                  >
                    Update
                  </button>
                  <button
                    className="delete button"
                    onClick={() => alert(`Delete ${product["name-product"]}`)}
                  >
                    Delete
                  </button>
                </span>
              </li>
            );
          })
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
    <ImageModal 
  show={showImageModal}
  onClose={() => setShowImageModal(false)}
  images={selectedImages}   
  koiId={selectedKoiId}
/>
    {/* Hiển thị modal */}
    <Modal 
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddProduct}
      />
  </Layout>
);
}