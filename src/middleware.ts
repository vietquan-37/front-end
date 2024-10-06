import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";



const role = ["ADMIN", "USER"];

export default withAuth(
  function middleware(req) {
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

  

    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token.role === "ADMIN"
    ) {
      return NextResponse.next();
    }

    if (
      req.nextUrl.pathname.startsWith("/user") &&
      req.nextauth.token.role === "Customer"
    ) {
      return NextResponse.next();
    }

  

    return NextResponse.redirect(new URL("/", req.url));
  },
  {
    callbacks: {
      authorized: (params) => {
        let { token } = params;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};