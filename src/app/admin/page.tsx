"use client";

import Layout from "@/app/admin/layoutAdmin";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  // Giả lập dữ liệu đếm cho mỗi mục (orders, products, users)
  const [stats, setStats] = useState([
    { label: "Total Orders", count: 120, bgColor: "bg-blue-100", textColor: "text-blue-700" },
    { label: "Total Products", count: 350, bgColor: "bg-green-100", textColor: "text-green-700" },
    { label: "Total Users", count: 0, bgColor: "bg-purple-100", textColor: "text-purple-700" }, // Số lượng người dùng sẽ được cập nhật từ API
  ]);

  useEffect(() => {
    // Hàm lấy số lượng người dùng
    const fetchUserCount = async () => {
      try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage

        if (!token) {
          console.error("Không có token.");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/admin/count-user`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats((prevStats) =>
            prevStats.map((stat) =>
              stat.label === "Total Users"
                ? { ...stat, count: data["user-count"] }
                : stat
            )
          );
        } else {
          console.error("Lỗi khi gọi API:", response.statusText);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    // Hàm lấy số lượng sản phẩm
    const fetchKoiCount = async () => {
      try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage

        if (!token) {
          console.error("Không có token.");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/koi/count`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats((prevStats) =>
            prevStats.map((stat) =>
              stat.label === "Total Products"
                ? { ...stat, count: data["koi-count"] }
                : stat
            )
          );
        } else {
          console.error("Lỗi khi gọi API:", response.statusText);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    // Hàm lấy số lượng đơn hàng
    const fetchOrderCount = async () => {
      try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage

        if (!token) {
          console.error("Không có token.");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Order/count`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats((prevStats) =>
            prevStats.map((stat) =>
              stat.label === "Total Orders"
                ? { ...stat, count: data["order-count"] }
                : stat
            )
          );
        } else {
          console.error("Lỗi khi gọi API:", response.statusText);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    // Gọi hàm lấy số lượng người dùng, sản phẩm và đơn hàng
    fetchUserCount();
    fetchKoiCount();
    fetchOrderCount();
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-lg ${stat.bgColor} hover:shadow-xl transition-shadow duration-300`}
            >
              <h3 className={`text-xl font-semibold ${stat.textColor} mb-2`}>{stat.label}</h3>
              <p className="text-4xl font-bold text-gray-900">{stat.count}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
