"use client";

import Layout from "@/app/admin/layoutAdmin";
import React, { useEffect, useState } from "react";
import "@/app/admin/style/ellipsis.css"; // Đảm bảo đường dẫn chính xác
import { useRouter } from 'next/navigation'; // Import useRouter

interface User {
  id: number;
  "full-name": string;
  email: string;
  "telephone-number": string;
  "role-name"?: string | null;
  address: string;
  status: string;
}

export default function Users() {
  const router = useRouter(); // Khởi tạo router
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sort, setSort] = useState(""); // Default sort
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Hàm lấy danh sách người dùng từ API
  const fetchUsers = async (page = 1, size = pageSize, searchTerm = "", sort = "") => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login'); // Điều hướng về trang đăng nhập nếu không có token
      return;
    }

    try {
      // Khởi tạo URL
      const url = new URL(`${process.env.NEXT_PUBLIC_API}/api/admin`);
      url.searchParams.append("page", String(page));
      url.searchParams.append("pageSize", String(size));
      if (searchTerm) url.searchParams.append("search", searchTerm);
      if (sort) url.searchParams.append("sort", sort);

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
      setUsers(data.data["list-data"]);
      setTotalPages(data.data["total-page"]);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại."); // Set error message
    }
  };

  // Gọi fetchUsers để lấy dữ liệu người dùng mặc định khi component khởi động
  useEffect(() => {
    fetchUsers(currentPage, pageSize, "", ""); // Gọi mà không có searchTerm và sort
  }, []);

  // Gọi lại fetchUsers mỗi khi có thay đổi về currentPage, pageSize, searchTerm hoặc sort
  useEffect(() => {
    fetchUsers(currentPage, pageSize, searchTerm, sort);
  }, [currentPage, pageSize, searchTerm, sort]);

  // Hàm xử lý sự kiện khi chọn loại người dùng
  const handleFilterChange = (value: string) => {
    switch (value) {
      case "name":
        setSort("name"); // Sort theo tên
        break;
      case "email":
        setSort("email"); // Sort theo email
        break;
      default:
        setSort(""); // Không sắp xếp khi không chọn gì
        break;
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-blue-900 text-2xl mb-4">Danh sách người dùng</h2>

        {/* Ô tìm kiếm và bộ lọc */}
        <div className="flex flex-col md:flex-row md:justify-between mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full md:w-1/5 mr-0 md:mr-4 mb-2 md:mb-0"
          />

          {/* Dropdown cho loại người dùng */}
          <select
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border p-2 rounded w-full md:w-1/6"
          >
            <option value="">Tất cả</option>
            <option value="name">OrderBy Name</option>
            <option value="email">OrderBy Email</option>
          </select>
        </div>

        {/* Tiêu đề */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 font-semibold mb-4">
          <span>ID</span>
          <span>User Name</span>
          <span>Email</span>
          <span>Address</span>
          <span>Phone</span>
          <span>Status</span>
          <span>Role</span>
        </div>

        {/* Danh sách người dùng */}
        <ul className="bg-white rounded-lg shadow-md">
          {users.length > 0 ? (
            users.map((user) => (
              <li
                key={user.id}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-4 border-b hover:bg-gray-100 transition duration-300"
              >
                <span>{user.id}</span>
                <span className="ellipsis">{user["full-name"]}</span>
                <span className="ellipsis">{user.email}</span>
                <span className="ellipsis">{user.address || "N/A"}</span>
                <span className="ellipsis">{user["telephone-number"]}</span>
                <span className="ellipsis">{user.status = 1 ? "Active" : "Inactive"}</span>
                <span className="ellipsis">{user["role-name"] || "N/A"}</span>
              </li>
            ))
          ) : (
            <li className="p-4 text-gray-600">Không có người dùng nào phù hợp.</li>
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