import {
  createNonMember,
  findNonMemberByInfo,
  findUpcomingByGuestId,
} from "../../../repositories/bookingTicket/non-member/nonmember.repository";

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
