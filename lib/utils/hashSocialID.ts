import crypto from "crypto";

export default function hashSocialID(
  provider: string,
  providerId: string
): string {
  const SECRET_PEPPER = process.env.SOCIAL_PEPPER_HMAC_SECRET!;
  const input = `${provider}|${providerId}:`;

  return crypto.createHmac("sha256", SECRET_PEPPER).update(input).digest("hex");
}
