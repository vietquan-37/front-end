"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, SignInResponse, useSession } from "next-auth/react";
import {
  ADMIN_PATH,
  USER_PATH,
} from "@/constants/routes";

const LoginPage = () => {
  const router = useRouter();
  const { data: session } = useSession(); // Extract user session data
  const [saveReq, setSaveReq] = useState<SignInResponse | undefined>();
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        username: username,
        password: password,
        redirect: false,
      });   
       // Kiểm tra phản hồi
    if (res?.error) {
      setIsLoading(false);
      setError("Đăng nhập không thành công.");
    } else {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/authentication/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token; // Lấy token từ phản hồi

        if (token) {
          localStorage.setItem('token', token); // Lưu token vào localStorage
          // Kiểm tra role trước khi điều hướng
          const userRole = data.role; // Giả sử bạn lấy role từ phản hồi
          if (userRole === "Admin") {
            router.push(ADMIN_PATH); // Điều hướng đến trang admin
          } else if (userRole === "Customer") {
            router.push(USER_PATH); // Điều hướng đến trang user
          } else {
            setError("Undefined role");
          }
        }
      } else {
        setError("Đăng nhập không thành công.");
      }
    }
  } catch (error: any) {
    setError(error?.message);
  }
  };

  useEffect(() => {
      // Chỉ điều hướng nếu có session đã đăng nhập
      if (session) {
        const user = session.user; // Lấy thông tin từ session sau khi đăng nhập
        if (user?.role === "Admin") {
          router.push(ADMIN_PATH);
        } else if (user?.role === "Customer") {
          router.push(USER_PATH);
        }
      }
  }, [router, session]);

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <form className="flex flex-col gap-8" onSubmit={onFinish}>
        <h1 className="text-2xl font-semibold">Login</h1>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">E-mail</label>
          <input
         
            name="username"
            placeholder="john@gmail.com"
            className="ring-2 ring-gray-300 rounded-md p-4"
            value={username}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="ring-2 ring-gray-300 rounded-md p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="text-sm underline cursor-pointer">Forgot Password?</div>

        <button
          className="bg-quan text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
       
          disabled={isLoading || !username || !password}
          type="submit"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {error && <div className="text-red-600">{error}</div>}

        <div className="text-sm underline cursor-pointer">
          {"Don't"} have an account?
        </div>

        {message && <div className="text-green-600 text-sm">{message}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
