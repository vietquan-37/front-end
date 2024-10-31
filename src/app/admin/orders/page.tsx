"use client";

import Layout from "@/app/admin/layoutAdmin";
import React, { useEffect, useState } from "react";
import "@/app/admin/style/ellipsis.css"; // Đảm bảo đường dẫn chính xác
import { useRouter } from 'next/navigation'; // Import useRouter

interface Order {
  id: number;
  "user-id": number;
  "user-name": string;
  "payment-date": string;
  status: boolean;
  "order-details": any[]; // Có thể thay đổi loại này tùy vào cấu trúc order-details
}

export default function Orders() {
  const router = useRouter(); // Khởi tạo router
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sort, setSort] = useState(""); // Default sort
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Hàm lấy danh sách đơn hàng từ API
  const fetchOrders = async (page = 1, size = pageSize, searchTerm = "", sort = "") => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login'); // Điều hướng về trang đăng nhập nếu không có token
      return;
    }

    try {
      // Khởi tạo URL
      const url = new URL(`${process.env.NEXT_PUBLIC_API}/api/Order`);
      url.searchParams.append("page", String(page));
      url.searchParams.append("pageSize", String(size));
      if (searchTerm) url.searchParams.append("search", searchTerm); // Nếu có tìm kiếm, thêm vào URL
      if (sort) url.searchParams.append("sort", sort); // Nếu có sắp xếp, thêm vào URL

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Thêm token vào header
          'Content-Type': 'application/json', // Đảm bảo Content-Type đúng
        },
      });

      // Kiểm tra trạng thái phản hồi
      if (response.status === 401) {
        localStorage.removeItem('token'); // Xóa token
        router.push('/login'); // Điều hướng đến trang đăng nhập
        return; // Ngừng thực hiện nếu không có quyền
      }
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setOrders(data.data["list-data"]);
      setTotalPages(data.data["total-page"]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại."); // Set error message
    }
  };

  // Gọi fetchOrders để lấy dữ liệu đơn hàng mặc định khi component khởi động
  useEffect(() => {
    fetchOrders(currentPage, pageSize, "", ""); // Gọi mà không có searchTerm và sort
  }, []);

  // Gọi lại fetchOrders mỗi khi có thay đổi về currentPage, pageSize, searchTerm hoặc sort
  useEffect(() => {
    fetchOrders(currentPage, pageSize, searchTerm, sort);
  }, [currentPage, pageSize, searchTerm, sort]);

  // Hàm xử lý sự kiện khi chọn loại sắp xếp
  const handleFilterChange = (value: string) => {
    switch (value) {
      case "pending":
        setSort("pending"); // Sort theo tên người dùng
        break;
        case "completed":
        setSort("completed"); // Sort theo tên người dùng
        break;
      default:
        setSort(""); // Không sắp xếp khi không chọn gì
        break;
    }
  };
// Hàm định dạng ngày
const formatDate = (dateString: string) => {
  const date = new Date(dateString); // Chuyển đổi chuỗi thành đối tượng Date
  const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 nếu cần
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (tháng bắt đầu từ 0)
  const year = date.getFullYear(); // Lấy năm
  return `${day}/${month}/${year}`; // Trả về định dạng dd/mm/yyyy
};
  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-blue-900 text-2xl mb-4">Danh sách đơn hàng</h2>

        {/* Ô tìm kiếm và bộ lọc */}
        <div className="flex flex-col md:flex-row md:justify-between mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full md:w-1/5 mr-0 md:mr-4 mb-2 md:mb-0"
          />

          {/* Dropdown cho loại sắp xếp */}
          <select
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border p-2 rounded w-full md:w-1/6"
          >
            <option value="">Tất cả</option>
            <option value="pending">Sắp xếp PENDING</option>
            <option value="completed">Sắp xếp COMPLETE</option>
          </select>
        </div>

        {/* Tiêu đề */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 font-semibold mb-4">
          <span>ID</span>
          <span>User Name</span>
          <span>Payment Date</span>
          <span>Status</span>
          <span>Order Details</span>
        </div>

        {/* Danh sách đơn hàng */}
        <ul className="bg-white rounded-lg shadow-md">
          {orders.length > 0 ? (
            orders.map((order) => (
              <li
                key={order.id}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 border-b hover:bg-gray-100 transition duration-300"
              >
                <span>{order.id}</span>
                <span className="ellipsis">{order["user-name"]}</span>
                <span className="ellipsis">{formatDate(order["payment-date"])}</span> {/* Gọi hàm formatDate */}
                <span className="ellipsis">{order.status ? "Completed" : "Pending"}</span>
                <span className="ellipsis">{order["order-details"].length > 0 ? "Details Available" : "No Details"}</span>
              </li>
            ))
          ) : (
            <li className="p-4 text-gray-600">Không có đơn hàng nào phù hợp.</li>
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
