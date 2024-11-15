"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import UseAxiosAuth from "@/utils/axiosClient";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Processing...");
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [hasExecuted, setHasExecuted] = useState(false); // Flag to prevent multiple executions
  const axiosAuth = UseAxiosAuth();

  // Function to handle window resizing for Confetti dimensions
  const updateWindowSize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };

  // Hook to add window resize event listener
  useEffect(() => {
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  // Payment execution effect
  useEffect(() => {
    const paymentId = searchParams.get("paymentId");
    const token = searchParams.get("token");
    const payerId = searchParams.get("PayerID");

    if (paymentId && token && payerId && !hasExecuted) {
      const executePayment = async () => {
        setHasExecuted(true); // Set the flag to true to prevent further calls
        try {
          const response = await axiosAuth.get(
            `/api/Payment/execute?paymentId=${paymentId}&token=${token}&PayerID=${payerId}`
          );

          if (response.data.success) {
            setStatus("Payment Successful!");
            setTimeout(() => router.push("/user/orders/"), 5000);
          } 
        } catch (error) {
          console.error("Error executing payment:", error);
          if (status !== "Payment Successful!") {
            setStatus("An error occurred during payment.");
          }
        }
      };

      executePayment();
    } else if (!paymentId || !token || !payerId) {
      setStatus("Invalid payment parameters.");
    }
  }, [searchParams, router, axiosAuth, hasExecuted, status]);

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen px-4 text-center">
      {status === "Payment Successful!" && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}
      <h1 className="text-4xl font-bold text-green-700">{status}</h1>
     
    </div>
  );
};

export default PaymentSuccessPage;
