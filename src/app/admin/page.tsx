"use client";

import Layout from "@/app/admin/layoutAdmin";
import React, { useEffect, useState } from "react";
import { FaArrowUp, FaShoppingCart, FaBox, FaUsers } from "react-icons/fa"; // Các icon
import { Bar } from 'react-chartjs-2'; // Import Chart.js và react-chartjs-2
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register các thành phần cần thiết của Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function Home() {
  const [stats, setStats] = useState([
    { label: "Total Orders", count: 120, bgColor: "bg-blue-100", textColor: "text-blue-700", icon: <FaShoppingCart /> },
    { label: "Total Products", count: 350, bgColor: "bg-green-100", textColor: "text-green-700", icon: <FaBox /> },
    { label: "Total Users", count: 0, bgColor: "bg-purple-100", textColor: "text-purple-700", icon: <FaUsers /> },
  ]);
  
  const [chartData, setChartData] = useState({
    labels: ['Orders', 'Products', 'Users'],
    datasets: [
      {
        label: 'Total Count',
        data: [8, 12, 11],  // Số liệu mẫu
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });


  useEffect(() => {
    const fetchUserCount = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/admin/count-user`, {
          method: "GET",
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(prevStats => prevStats.map(stat =>
            stat.label === "Total Users" ? { ...stat, count: data["user-count"] } : stat
          ));
        }
      } catch (error) {
        console.error("Error fetching user count", error);
      }
    };

    const fetchKoiCount = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/koi/count`, {
          method: "GET",
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(prevStats => prevStats.map(stat =>
            stat.label === "Total Products" ? { ...stat, count: data["koi-count"] } : stat
          ));
        }
      } catch (error) {
        console.error("Error fetching koi count", error);
      }
    };

    const fetchOrderCount = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Order/count`, {
          method: "GET",
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(prevStats => prevStats.map(stat =>
            stat.label === "Total Orders" ? { ...stat, count: data["order-count"] } : stat
          ));
          setChartData((prevData) => ({
            ...prevData,
            datasets: [
              {
                ...prevData.datasets[0],
                data: [data["order-count"], prevData.datasets[0].data[1], prevData.datasets[0].data[2]], // Cập nhật dữ liệu biểu đồ
              },
            ],
          }));
        }
      } catch (error) {
        console.error("Error fetching order count", error);
      }
    };

    fetchUserCount();
    fetchKoiCount();
    fetchOrderCount();
  }, []);
// Hàm để chuyển đổi số liệu sang dạng dễ đọc
const formatNumber = (num: number) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B"; // "B" cho Billions
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // "M" cho Millions
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k"; // "k" cho Thousands
  } else {
    return num.toString(); // Trả lại số nếu nhỏ hơn 1000
  }
};

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
            <div className="flex items-center mb-2">
              <div className={`mr-3 ${stat.textColor}`}>{stat.icon}</div>
              <h3 className={`text-xl font-semibold ${stat.textColor}`}>{stat.label}</h3>
            </div>
            <p className="text-4xl font-bold text-gray-900">{formatNumber(stat.count)}</p>
            <div className="mt-4">
              <div className="flex items-center">
                <FaArrowUp className="text-green-500 mr-2" />
                <span className="text-sm text-gray-600"></span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Biểu đồ */}
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Statistics Overview</h3>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Product, Order, and User Count',
                },
                tooltip: {
                  enabled: true,
                },
              },
            }}
            height={100} // Thay đổi chiều cao của biểu đồ
            width={500}  // Thay đổi chiều rộng của biểu đồ (hoặc để mặc định nếu muốn nó tự điều chỉnh)
          />
        </div>
      </div>
    </div>
  </Layout>
);
}
