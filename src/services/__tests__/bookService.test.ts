import { insertBooking } from "../../repositories/bookingTicket/booking.repository";
import { bookService } from "../bookingTicket/bookingService";

const mockWithTransaction = jest.fn(async (callback) => {
  await callback();
});

const mockEndSession = jest.fn();

jest.mock("../../../lib/mongodb", () => ({
  __esModule: true,
  default: Promise.resolve({
    startSession: jest.fn(() => ({
      withTransaction: mockWithTransaction,
      endSession: mockEndSession,
    })),
  }),
}));

jest.mock("../../repositories/bookingTicket/booking.repository", () => ({
  insertBooking: jest.fn(),
}));

describe("bookService 예약서비스", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("성공적으로 예매할경우 bookingResult를 반환한다", async () => {
    (insertBooking as jest.Mock).mockResolvedValue({
      bookedAt: new Date("2025-01-01"),
      seatCount: 1,
    });

    const result = await bookService("user1", "showtime1", [
      { row: "A", number: 1 },
    ]);

    expect(insertBooking).toHaveBeenCalledTimes(1);
    expect(mockWithTransaction).toHaveBeenCalledTimes(1);
    expect(mockEndSession).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      bookedAt: "2025-01-01T00:00:00.000Z",
      seatCount: 1,
      status: "confirmed",
    });
  });

  test("bookingResult를 받지 못할경우 에러를 던진다", async () => {
    (insertBooking as jest.Mock).mockResolvedValue(null);

    await expect(
      bookService("user1", "showtime1", [{ row: "A", number: 1 }]),
    ).rejects.toThrow("예매 처리 중 오류가 발생했습니다.");

    expect(mockWithTransaction).toHaveBeenCalledTimes(1);
    expect(mockEndSession).toHaveBeenCalledTimes(1);
  });
});
