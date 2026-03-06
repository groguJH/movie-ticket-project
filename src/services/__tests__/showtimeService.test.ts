import { getShowtimes } from "../bookingTicket/showtimeService";
import { findShowtimesByDate } from "../../repositories/bookingTicket/showtime.repository";

jest.mock("../../repositories/bookingTicket/showtime.repository", () => ({
  findShowtimesByDate: jest.fn(),
}));

describe("showtimeService 특정 영화의 특정 날짜의 상영시간 조회 서비스 함수", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("영화아이디 혹은 예약할 날짜가 없으면 에러를 던진다", async () => {
    await expect(getShowtimes("", "2026-01-01")).rejects.toThrow(
      "영화아이디와 날짜는 필수입니다.",
    );

    await expect(getShowtimes("getExampleID", "")).rejects.toThrow(
      "영화아이디와 날짜는 필수입니다.",
    );
  });

  test("정상적으로 showtimelist 리스트를 반환한다", async () => {
    const fakeShowtimeList = [
      { _id: "1", movieId: "getExampleID", startTime: new Date() },
      { _id: "2", movieId: "getExampleID", startTime: new Date() },
    ];
    (findShowtimesByDate as unknown as jest.Mock).mockResolvedValue(
      fakeShowtimeList,
    );
    const result = await getShowtimes("getExampleID", "2026-01-01");
    expect(findShowtimesByDate).toHaveBeenCalledTimes(1);
    const callArgs = (findShowtimesByDate as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toBe("getExampleID");

    expect(callArgs[1]).toBeInstanceOf(Date);
    expect(callArgs[2]).toBeInstanceOf(Date);
    expect(result).toEqual(fakeShowtimeList);
  });
});
