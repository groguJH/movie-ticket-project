import crypto from "crypto";

// 소셜 로그인 고유ID를 해싱하는 유틸함수
export default function hashSocialID(
  provider: string,
  providerId: string
): string {
  // 환경 변수에서 pepper 값을 가져옵니다.
  const SECRET_PEPPER = process.env.SOCIAL_PEPPER_HMAC_SECRET!; // !타입선언필수
  const input = `${provider}|${providerId}:`;

  return crypto.createHmac("sha256", SECRET_PEPPER).update(input).digest("hex");
}
