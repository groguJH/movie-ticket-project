import { findBookingsByShowtime } from "../../repositories/bookingTicket/bookingReceipt.repository";

export async function BookingReceiptService(showtimeId: string) {
  return findBookingsByShowtime(showtimeId);
}
