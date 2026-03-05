import { test, expect } from "@playwright/test";
import jwt, { SignOptions } from "jsonwebtoken";

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

function getSessionCookieName() {
  return process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
}

/**
 *
 *
 * @param payload
 * @param options
 * @returns
 */
function makeNextAuthJwtToken(
  payload: Record<string, any>,
  options?: SignOptions,
) {
  const secret = process.env.NEXTAUTH_SECRET ?? "test-secret";

  const tokenPayload = {
    ...payload,
    sub: payload.id ?? payload.sub ?? "test-sub",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  return jwt.sign(tokenPayload, secret, options ?? {});
}

test.describe("Auth & Admin middleware", () => {
  test("로그인하지 않은 사용자가 /mypage 접속 시 인증 리다이렉트", async ({
    page,
  }) => {
    await page.goto(`${BASE}/mypage`);
    await expect(page).toHaveURL(/\/\?reason=auth/);
    await expect(
      page.locator("text=로그인이 필요한 서비스입니다"),
    ).toBeVisible();
  });

  test("로그인하지 않은 사용자가 /feedbackAdmin 접속 시 관리자 권한 리다이렉트", async ({
    page,
  }) => {
    await page.goto(`${BASE}/feedbackAdmin`);
    await expect(page).toHaveURL(/\/\?reason=admin/);
    await expect(page.locator("text=접근 권한이 없습니다")).toBeVisible();
  });

  test("일반 사용자(user role)가 /feedbackAdmin 접속 시 관리자 권한 리다이렉트", async ({
    page,
    context,
  }) => {
    const token = makeNextAuthJwtToken({
      id: "user-123",
      name: "일반회원",
      email: "user@example.com",
      picture: null,
      provider: "credentials",
      role: "user",
    });

    await context.addCookies([
      {
        name: getSessionCookieName(),
        value: token,
        domain: new URL(BASE).hostname,
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ]);

    await page.goto(`${BASE}/feedbackAdmin`);
    await expect(page).toHaveURL(/\/\?reason=admin/);
    await expect(page.locator("text=접근 권한이 없습니다")).toBeVisible();
  });

  test("관리자(admin role)가 /feedbackAdmin 접속 시 접근 허용", async ({
    page,
    context,
  }) => {
    const token = makeNextAuthJwtToken({
      id: "admin-1",
      name: "관리자",
      email: "admin1@google.com",
      picture: null,
      provider: "credentials",
      role: "admin",
    });

    await context.addCookies([
      {
        name: getSessionCookieName(),
        value: token,
        domain: new URL(BASE).hostname,
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ]);

    await page.goto(`${BASE}/feedbackAdmin`);
    await expect(page).toHaveURL(/\/feedbackAdmin/);
    await expect(page).not.toHaveURL(/\?reason=/);
  });
});
