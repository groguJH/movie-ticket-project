import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * 관리자 권한 확인하는 핸들러
 * @param req
 * @param res
 * @param handler
 * @description
 * API 핸들러에서 사용하며 권한이 없을경우 403 에러를 반환합니다.
 */

export async function requireAdminApi(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<any>
) {
  const session = await getSession({ req });
  if (!session || (session.user as any)?.role !== "admin") {
    return res
      .status(403)
      .json({ ok: false, message: "Admin access required" });
  }
  return handler(req, res);
}
