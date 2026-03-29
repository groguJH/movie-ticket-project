import React from "react";
import { DatePicker, Select, Tabs, Card, Button } from "antd";
import dayjs from "dayjs";
import { BookingPresenterProps } from "../../../../types/movieBooking";
import { Container } from "../../utils/MyPageLayout";
import RefundPresenter from "./RefundPresenter";
import { SeatGrid } from "../../utils/Layout";
import { EmptyMovieList, InlineSmallSpinner } from "../../utils/loadingUI";

export default function BookingPresenter({
  availableTheaters,
  filteredShowtimes,
  seats,
  chosenSeats,
  bookings,
  selectedDate,
  selectedTheater,
  onDateChange,
  onTheaterSelect,
  onTimeSelect,
  onSeatToggle,
  onBook,
  bookInfo,
  onTabChange,
  activeTab,
  selectedShowtime,
  movieTitle,
  userName,
  hasNoSchedule,
  isCheckingCanBook,
  isShowtimeLoading,
  isBookingLoading,
  isSeatLoading,
}: BookingPresenterProps) {
  const { TabPane } = Tabs;
  const pickerStyle = { width: "100%", maxWidth: 250 };

  if (isCheckingCanBook) {
    return null;
  }

  if (hasNoSchedule) {
    return <EmptyMovieList />;
  }

  return (
    <>
      <>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => onTabChange(key as any)}
          tabBarStyle={{ marginBottom: 10 }}
        >
          <TabPane tab="영화선택" key="movie" />
          <TabPane tab="상영관 선택" key="date" />
          <TabPane tab="좌석선택" key="seat" />
          <TabPane tab="예매하기" key="book" />
          <TabPane tab="예매내역 확인" key="confirm" />
        </Tabs>

        {activeTab === "movie" && <h2>{movieTitle} 예매하기</h2>}

        <Container>
          {activeTab === "date" && (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <DatePicker
                style={pickerStyle}
                onChange={(_, dateStr) =>
                  onDateChange(typeof dateStr === "string" ? dateStr : "")
                }
                disabledDate={(d) => !d || d.isBefore(dayjs(), "day")}
              />

              {availableTheaters.length > 0 && (
                <Select
                  placeholder="영화관 선택"
                  style={pickerStyle}
                  options={availableTheaters.map((t) => ({
                    label: t,
                    value: t,
                  }))}
                  value={selectedTheater || undefined}
                  onChange={onTheaterSelect}
                />
              )}

              {isShowtimeLoading ? (
                <div
                  style={{
                    minHeight: 32,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InlineSmallSpinner />
                </div>
              ) : filteredShowtimes.length > 0 ? (
                <Select
                  placeholder="시간 선택"
                  style={pickerStyle}
                  options={filteredShowtimes.map((s) => ({
                    label: dayjs(s.startTime).format("HH:mm"),
                    value: s._id,
                  }))}
                  value={selectedShowtime || undefined}
                  onChange={onTimeSelect}
                />
              ) : selectedDate ? (
                <div
                  style={{
                    minHeight: 32,
                    display: "flex",
                    alignItems: "center",
                    color: "#888",
                  }}
                ></div>
              ) : null}
            </div>
          )}

          {activeTab === "seat" && (
            <>
              {isSeatLoading ? (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <InlineSmallSpinner />
                </div>
              ) : seats.length > 0 ? (
                <SeatGrid>
                  {seats.map((seat) => {
                    const isChosen = chosenSeats.some(
                      (c) => c.row === seat.row && c.number === seat.number,
                    );
                    return (
                      <Button
                        key={`${seat.row}${seat.number}`}
                        type={isChosen ? "primary" : "default"}
                        disabled={seat.status === "sold"}
                        onClick={() => onSeatToggle(seat)}
                      >
                        {seat.row}
                        {seat.number}
                      </Button>
                    );
                  })}
                </SeatGrid>
              ) : (
                <div
                  style={{ textAlign: "center", marginTop: 16, color: "#888" }}
                >
                  <InlineSmallSpinner />
                </div>
              )}
            </>
          )}

          {activeTab === "book" && (
            <Container>
              <RefundPresenter />
              <Button
                type="primary"
                disabled={chosenSeats.length === 0 || isBookingLoading}
                style={{ display: "block", margin: "0 auto" }}
                onClick={onBook}
              >
                {isBookingLoading ? (
                  <div style={{ textAlign: "center", marginTop: 12 }}>
                    <InlineSmallSpinner />
                  </div>
                ) : (
                  `예매하기 (${chosenSeats.length}석)`
                )}
              </Button>
            </Container>
          )}

          {activeTab === "confirm" && bookInfo && (
            <>
              <h3>
                🍿 {userName === "guest" ? "비회원" : userName}님 예매가
                완료되었습니다!
              </h3>
              {bookings.map((b) => (
                <Card
                  key={b._id}
                  title={`예매번호: ${bookInfo.bookingNumber}`}
                  style={{ marginBottom: 16, width: "100%" }}
                >
                  <p>날짜: {selectedDate}</p>
                  <p>영화관: {selectedTheater}</p>
                  <p>
                    시간:{" "}
                    {dayjs(
                      filteredShowtimes.find((s) => s._id === b.showtimeId)
                        ?.startTime,
                    ).format("HH:mm")}
                  </p>
                  <p>
                    예매일시:{" "}
                    {dayjs(b.bookedAt).format("YYYY년 MM월 DD일 HH시mm분")}
                  </p>
                  <p>
                    좌석: {b.seats.map((s) => `${s.row}${s.number}`).join(", ")}
                  </p>
                </Card>
              ))}
            </>
          )}
        </Container>
      </>
    </>
  );
}
