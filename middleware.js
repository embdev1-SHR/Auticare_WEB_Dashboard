import { NextResponse, NextRequest } from "next/server";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants/auth.constant";

/**
 * it runs on every request to the app
 * --- request object is immutable
 * @param {NextRequest} req
 * @returns
 */

export const middleware = async (req, event) => {
  const { pathname } = req.nextUrl;
  const authToken = req.cookies.get(ACCESS_TOKEN);
  const refreshToken = req.cookies.get(REFRESH_TOKEN);

  if (
    pathname == "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/center-signup") ||
    pathname.startsWith("/client-signup") ||
    pathname.startsWith("/confirm-otp") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/forgot-password")
  ) {
    if (authToken && refreshToken)
      return NextResponse.redirect(new URL("/dashboard", req.url));
    else return NextResponse.next();
  }
  if (
    pathname.startsWith("/vercel") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/confirm-otp") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }
  if (authToken) {
    return NextResponse.next({
      headers: {
        token: JSON.stringify(authToken),
      },
    });
  }

  return NextResponse.redirect(new URL("/login", req.url));
};

// export const config = {
//   matcher: ["/auth"],
// };
