import { findSeatsShowTimes } from "../../repositories/bookingTicket/seat.repository";
import { SeatService } from "../bookingTicket/seatService";

jest.mock("../../repositories/bookingTicket/seat.repository", () => ({
  findSeatsShowTimes: jest.fn(),
}));

describe("SeatService 좌석 정보를 조회합니다", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("성공적으로 좌석 정보를 조회할 경우 좌석 정보를 반환한다", async () => {
    const fakeSeatData = [
      { row: "A", number: 1, isBooked: true },
      { row: "A", number: 2, isBooked: true },
    ];

    (findSeatsShowTimes as unknown as jest.Mock).mockResolvedValue(
      fakeSeatData,
    );
    const result = await SeatService("showtimesExampleId");
    expect(findSeatsShowTimes).toHaveBeenCalledTimes(1);
    expect(findSeatsShowTimes).toHaveBeenCalledWith("showtimesExampleId");
    expect(result).toEqual(fakeSeatData);
  });
});
