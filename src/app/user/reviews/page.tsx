"use client";
import { useEffect, useState } from "react";
import useAxiosAuth from "@/utils/axiosClient";
import { useRouter } from "next/router";

type Review = {
  id: number;
  comment: string;
  rating: number;
  "order-detail-id": number;
  "koi-name": string;
  "koi-image": string;
};

const UserReviews = () => {
  const axiosAuth = useAxiosAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosAuth.get("/api/Review/user");
        if (response.data.success) {
          setReviews(response.data.data);
        } else {
          setError("Failed to load reviews.");
        }
      } catch (err) {
        setError("An error occurred while fetching reviews.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [axiosAuth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <span className="text-xl text-gray-500">Loading your reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-16">
        <span className="text-xl text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Reviews</h2>
      {reviews.length === 0 ? (
        <div className="text-center text-lg text-gray-700">You have not left any reviews yet.</div>
      ) : (
        <div>
          {reviews.map((review) => (
            <div key={review.id} className="mb-6 p-6 border rounded-lg shadow-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Review ID: {review.id}</span>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">{`${review.rating} / 5`}</span>
                  <span className="text-sm text-gray-500">Rating</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                <span className="font-semibold">Order Detail ID:</span> {review["order-detail-id"]}
              </div>
              <div className="flex items-center mb-4">
                <img src={review["koi-image"]} alt={review["koi-name"]} className="w-20 h-20 rounded-full mr-4" />
                <span className="text-lg font-semibold">{review["koi-name"]}</span>
              </div>
              <p className="text-lg">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviews;
