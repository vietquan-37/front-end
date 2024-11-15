"use client";

// OrderHistory component
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAxiosAuth from "@/utils/axiosClient";
import Image from "next/image";
import ReviewModal from "@/components/ReviewAction";

type KoiImage = {
  "image-url": string;
};

type Koi = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  size: number;
  dob: string;
  "category-name": string;
  images: KoiImage[];
};

type OrderDetail = {
  id: number;
  price: number;
  quantity: number;
  koi: Koi;
  "is-reviewed": boolean;
};

type Order = {
  id: number;
  "order-date": string;
  "order-status": boolean;
  "shipping-fee": number;
  "total-price": number;
  "user-id": number;
  "order-details": OrderDetail[];
};

const OrderHistory = () => {
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);
  const [selectedKoiName, setSelectedKoiName] = useState<string>("");

  const fetchOrderHistory = async () => {
    try {
      const response = await axiosAuth.get("/history");
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch order history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [axiosAuth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <span className="text-xl text-gray-500">Loading your order history...</span>
      </div>
    );
  }

  const handleViewReviews = () => {
    router.push("/user/reviews");
  };

  const openReviewModal = (orderDetailId: number, koiName: string) => {
    setSelectedDetailId(orderDetailId);
    setSelectedKoiName(koiName);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Order History</h2>
      {orders.length === 0 ? (
        <div className="text-center text-lg text-gray-700">You have no previous orders.</div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="mb-12 p-6 border rounded-lg shadow-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Order ID: {order.id}</span>
              <span className={`text-sm ${order["order-status"] ? "text-green-500" : "text-red-500"}`}>
                {order["order-status"] ? "Completed" : "Pending"}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              <span>Order Date: {new Date(order["order-date"]).toLocaleDateString()}</span>
              <span className="ml-4">Shipping Fee: {order["shipping-fee"].toLocaleString()} VNĐ</span>
              <span className="ml-4">Total Price: {order["total-price"].toLocaleString()} VNĐ</span>
            </div>
            <div className="border-t mt-4 pt-4">
              <h3 className="text-lg font-semibold mb-4">Order Details</h3>
              {order["order-details"].map((detail) => (
                <div key={detail.id} className="flex gap-6 mb-4">
                  <div className="w-1/4">
                    <Image
                      src={detail.koi.images[0]["image-url"]}
                      alt={detail.koi.name}
                      width={120}
                      height={120}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="w-3/4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-xl">{detail.koi.name}</h4>
                      <p className="text-gray-500 text-sm">{detail.koi["category-name"]}</p>
                      <p className="text-sm text-gray-700 mt-2">{detail.koi.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-semibold text-gray-900">
                        {detail.price.toLocaleString()} VNĐ x {detail.quantity}
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {(detail.price * detail.quantity).toLocaleString()} VNĐ
                      </span>
                    </div>
                    <div className="mt-4">
                      {detail["is-reviewed"] ? (
                        <button
                          onClick={handleViewReviews}
                          className="text-blue-500 underline"
                        >
                          View Reviews
                        </button>
                      ) : (
                        <button
                          onClick={() => openReviewModal(detail.id, detail.koi.name)}
                          className="text-blue-500 underline"
                        >
                          Add Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      {showModal && selectedDetailId !== null && (
        <ReviewModal
          orderDetailId={selectedDetailId}
          koiName={selectedKoiName}
          onClose={() => {
            setShowModal(false);
            fetchOrderHistory(); // Refresh orders after closing the modal
          }}
        />
      )}
    </div>
  );
};

export default OrderHistory;

