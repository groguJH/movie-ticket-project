import { NextApiRequest, NextApiResponse } from "next";
import { createNonMemberService } from "../../../src/services/bookingTicket/non-member/findNonMemberService";
import { findNonMemberByInfo } from "../../../src/repositories/bookingTicket/non-member/nonmember.repository";

/**
 *  비회원 생성 API
 *  form 에서 입력받은 비회원 정보를 바탕으로 비회원 예매를 검증 후, 곧바로 반환합니다.❓
 * @description
 *  - Method: POST
 *  - Body: { name: string, birth: string, phone: string, password: string }
 *  - Response: 비회원 생성 후 비회원 ID 반환  { nonBookingId: string }
 * @throws 400 - 잘못된 요청 (필수 입력칸 누락 등)
 * @throws 500 - 서버 에러
 * @tutorials
 */
export default async function nonMemberHanlder(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "허용되지 않은 메서드입니다." });
  }
  try {
    const { name, birth, phone, password, movieId } = req.body;
    if (!name || !birth || !phone || !password) {
      return res.status(400).json({ message: "필수 입력칸이 누락되었습니다." });
    }

    const payload = { name, birth, phone, password, movieId };
    const existing = await findNonMemberByInfo(payload);

    if (existing) {
      return res.status(200).json({
        nonMemberId: existing._id,
      });
    }

    const nonMemberId = await createNonMemberService(payload);
    return res.status(201).json({ nonMemberId });
  } catch (err) {
    return res.status(500).json({ message: "서버 에러", err });
  }
}
