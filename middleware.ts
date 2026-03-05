import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_PATHS = ["/mypage"];
const ADMIN_PROTECTED_PATHS = ["/feedbackAdmin"];

/**
 * 로그인, 관리자를 확인하는 미들웨어
 * @param req
 * @return
 *
 */

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const homeUrl = new URL("/", req.url);
      homeUrl.searchParams.set("reason", "auth");
      return NextResponse.redirect(homeUrl);
    }
  }

  if (ADMIN_PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    if (token?.role !== "admin") {
      const homeUrl = new URL("/", req.url);
      homeUrl.searchParams.set("reason", "admin");
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mypage/:path*", "/feedbackAdmin/:path*"],
};
