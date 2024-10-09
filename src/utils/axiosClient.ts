"use client";

import axios from "axios";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const DOMAIN = `${process.env.NEXT_PUBLIC_API}`;

export const axiosAuth = axios.create({
  baseURL: DOMAIN,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

const UseAxiosAuth = () => {
  const { data: session } = useSession();
  const path = usePathname();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      async (config) => {
        const sessionUse = await getSession();
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${sessionUse?.user?.token as string}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !prevRequest?.sent
        ) {
          // Invalidate the session and ask the user to sign in again
          await signOut();
          await signIn();
        }

        if (error.response?.status === 400 || error.response?.status === 404) {
          console.log(error.response.data.error);
          return Promise.resolve(error.response);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [session, path]);

  return axiosAuth;
};

export default UseAxiosAuth;
