import { NextApiRequest, NextApiResponse } from "next";
import { BookingReceiptService } from "../../../src/services/bookingTicket/bookingReciptService";

/**
 * 예매 영수증 정보를 반환하는 API 핸들러
 * @param req
 * @param res
 * @description
 * - Method: GET
 * - Response: 예매 영수증 정보 객체
 * @throws 400 - 허용되지 않은 메서드
 * @throws 500 - 서버 오류
 *
 */
export default async function bookingReceipt(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (req.method !== "GET") {
    return res.status(400).json({ error: "허용되지 않은 메서드입니다." });
  }

  try {
    const list = await BookingReceiptService(id as string);
    res.status(200).json(list);
  } catch (err: any) {
    console.error("예매 영수증 조회 실패:", err);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
}
