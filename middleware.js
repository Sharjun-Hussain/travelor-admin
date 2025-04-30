// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  //   const token = request.cookies.get("accessToken");

  //   const protectedPaths = ["/dashboard", "/profile", "/admin"];
  //   const pathname = request.nextUrl.pathname;

  //   const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  //   if (isProtected && !token) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/login";
  //     return NextResponse.redirect(url);
  //   }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*"],
};
