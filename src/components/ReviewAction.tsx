"use client";

import { useState } from "react";
import Image from "next/image";
import useAxiosAuth from "@/utils/axiosClient";

type ReviewModalProps = {
  orderDetailId: number;
  koiName: string;
  onClose: () => void;
};

const ReviewModal = ({ orderDetailId, koiName, onClose }: ReviewModalProps) => {
  const axiosAuth = useAxiosAuth();
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment || rating < 1 || rating > 5) {
      setError("Please provide a valid comment and rating between 1 and 5.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosAuth.post(
        `/api/Review?orderId=${orderDetailId}`,
        {
          comment,
          rating,
        }
      );
      if (response.data.success) {
        onClose();
        alert("Review added successfully!");
      } else {
        setError("Failed to submit your review. Please try again later.");
      }
    } catch (err) {
      setError("An error occurred while submitting your review.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-2xl font-semibold text-center mb-4">
          Add Review for {koiName}
        </h3>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="rating" className="block text-lg font-medium mb-2">
              Rating:
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`w-8 h-8 ${
                    rating >= value ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  <Image
                    src="/star.png"
                    alt="Star"
                    width={24}
                    height={24}
                    className={`${rating >= value ? "opacity-100" : "opacity-50"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-lg font-medium">
              Comment:
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2 p-2 border rounded w-full"
              rows={4}
              placeholder="Enter your review..."
            ></textarea>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white bg-gray-500 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-500 rounded"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
