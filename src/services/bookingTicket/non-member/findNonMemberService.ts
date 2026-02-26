import {
  createNonMember,
  findNonMemberByInfo,
  findUpcomingByGuestId,
} from "../../../repositories/bookingTicket/non-member/nonmember.repository";

// 비회원 정보를 생성하여 저장하는 함수
export async function createNonMemberService(payload: {
  name: string;
  birth: string;
  phone: string;
  password: string;
  movieId?: string;
}) {
  const nonMemberUserId = await createNonMember(payload);
  return nonMemberUserId;
}

// ✅ 비회원 조회 (이게 search에서 사용해야 함)
export async function findNonMemberService(payload: {
  name: string;
  birth: string;
  phone: string;
  password: string;
}) {
  const user = await findNonMemberByInfo(payload);

  if (!user) {
    throw new Error("비회원 정보가 없습니다.");
  }

  return user?._id;
}

// 비회원의 예매 내역을 조회하여 다가오는 예매와 지난 예매로 구분하여 반환하는 함수
export async function findUpcomingService(guestId: string) {
  const bookings = await findUpcomingByGuestId(guestId);

  const now = new Date();

  const upcoming = bookings.filter(
    (b: any) => b.showtime && b.showtime.startTime >= now,
  );
  const past = bookings.filter(
    (b: any) => b.showtime && b.showtime.startTime < now,
  );

  return {
    upcoming,
    past,
  };
}
