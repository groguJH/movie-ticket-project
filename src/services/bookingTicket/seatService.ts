import { findSeatsShowTimes } from "../../repositories/bookingTicket/seat.repository";

export async function SeatService(showtimeId: string) {
  return findSeatsShowTimes(showtimeId);
}
