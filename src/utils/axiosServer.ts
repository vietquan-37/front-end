import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { LOGIN_PATH } from "@/constants/routes";
import axios from "axios";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const DOMAIN = `${process.env.NEXT_PUBLIC_API}`;

export const ACCESS_TOKEN: string = "accessToken";


export const http = axios.create({
  baseURL: DOMAIN,
  headers: {
    "content-type": "application/json",
  },
  timeout: 10000,
});

http.interceptors.request.use(
  async (config) => {
    const session = await getServerSession(authOptions);
    const bearerToken = session?.user?.access as string;
    config.headers.Authorization = `Bearer ${bearerToken}`;
    console.log("have set bearer: ", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 400 || error.response?.status === 404) {
      console.log(error.response.message);

      console.log("Status 400 during HTTP request.");
      return Promise.resolve(error.response);
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Status 401 || 403 during HTTP request.");

      redirect(LOGIN_PATH);
    }

    return Promise.reject(error);
  }
);