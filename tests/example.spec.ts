import { test, expect, Page } from "@playwright/test";

test("로그인하지 않은 사용자가 마이페이지로 접속시 리다이렉트로 보냅니다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/mypage");
  await expect(page).toHaveURL(/\/\?reason=auth/);
  await expect(page.locator("text=로그인이 필요한 서비스입니다")).toBeVisible();
});

test("관리자가 아닌 사용자가 /admin 접속시 리다이렉트로 보냅니다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/feedbackAdmin");
  await expect(page).toHaveURL(/\/\?reason=auth/);
  await expect(page.locator("text=접근 권한이 없습니다")).toBeVisible();
});
