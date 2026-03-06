import { NextApiRequest, NextApiResponse } from "next";
import {
  findNonMemberService,
  findUpcomingService,
} from "../../../src/services/bookingTicket/non-member/findNonMemberService";

/**
 * 비회원 정보 확인 API
 * @param req
 * @param res
 * @description
 * - Method: POST
 *  - Body: { name: string, birth: string, phone: string, password: string }
 * - Response: { userId: string }
 * @throws 404 - 비회원 정보가 없음
 * @throws 405 - 허용되지 않은 메서드
 * @throws 500 - 서버 에러
 *
 */

export default async function nonMemberSearchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
  }

  try {
    const { name, birth, phone, password } = req.body;

    if (!name || !birth || !phone || !password) {
      return res.status(400).json({ message: "필수 정보가 누락되었습니다." });
    }
    const guestId = await findNonMemberService({
      name,
      birth,
      phone,
      password,
    });
    const { upcoming, past } = await findUpcomingService(guestId.toString());

    return res.status(200).json({
      guestId,
      upcoming,
      past,
    });
  } catch (err: any) {
    console.error("비회원 예매 조회 오류:", err);

    if (err.message === "비회원 정보가 없습니다.") {
      return res.status(404).json({ message: "비회원 정보가 없습니다." });
    }
    return res
      .status(500)
      .json({ message: "서버 에러로 인해 다시 시도해주세요" });
  }
}
