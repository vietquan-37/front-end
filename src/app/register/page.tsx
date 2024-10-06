"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { http } from "@/utils/config";

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",  
    telephonenumber: "", 
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const response = await http.post("/api/authentication/register", formData);
  
      // Assuming response.data is the structure from the API response
      const { success, message, error } = response.data;
  
      if (success) {
        setMessage(message || "Registration successful! Please check your email to confirm your account.");
        setEmailSent(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(error);
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold">Register</h1>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullname"  // Aligned with formData key
            placeholder="Enter your full name"
            className="ring-2 ring-gray-300 rounded-md p-4"
            value={formData.fullname}  // Aligned with formData key
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="ring-2 ring-gray-300 rounded-md p-4"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="ring-2 ring-gray-300 rounded-md p-4"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Phone</label>
          <input
            type="text"
            name="telephonenumber"  // Aligned with formData key
            placeholder="Enter your phone number"
            className="ring-2 ring-gray-300 rounded-md p-4"
            value={formData.telephonenumber}  // Aligned with formData key
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="bg-quan text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading || emailSent}
        >
          {isLoading ? "Loading..." : "Register"}
        </button>

        {emailSent && (
          <div className="text-green-600 text-sm">
            Registration successful! Please check your email to confirm your account before logging in.
          </div>
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}

        {!emailSent && (
          <Link className="text-sm underline cursor-pointer" href="/login">
            Already have an account?
          </Link>
        )}
      </form>
    </div>
  );
};

export default RegisterPage;
