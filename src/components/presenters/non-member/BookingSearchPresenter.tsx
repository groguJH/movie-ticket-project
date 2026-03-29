import React from "react";
import { Card } from "antd";
import dayjs from "dayjs";

interface PresenterProps {
  error: string | null;
  loading: boolean;
  upcoming: any[];
  past: any[];
}

export default function BookingSearchPresenter({
  error,
  loading,
  upcoming,
  past,
}: PresenterProps) {
  return (
    <div style={{ marginTop: 16, width: "100%", maxWidth: 648 }}>
      <Card
        title={`상영 예정 (${upcoming.length}건)`}
        style={{ marginBottom: 16 }}
      >
        {upcoming.length === 0 ? (
          <div>예정된 예매가 없습니다.</div>
        ) : (
          upcoming.map((b: any) => (
            <Card
              key={b._id}
              style={{ marginBottom: 12 }}
              type="inner"
              title={`예매번호: ${b.bookingNumber}`}
            >
              <p>영화: {b.movie.title}</p>
              <p>영화관: {b.showtime.theater}</p>
              <p>
                상영일시:{" "}
                {dayjs(b.showtime.startTime).format("YYYY-MM-DD HH:mm")}
              </p>
              <p>
                좌석:{" "}
                {b.seats.map((s: any) => `${s.row}${s.number}`).join(", ")}
              </p>
              <p>예매일시: {dayjs(b.bookedAt).format("YYYY-MM-DD HH:mm")}</p>
            </Card>
          ))
        )}
      </Card>

      <Card title={`지난 예매 (${past.length}건)`}>
        {past.length === 0 ? (
          <div>지난 예매가 없습니다.</div>
        ) : (
          past.map((b: any) => (
            <Card
              key={b._id}
              style={{ marginBottom: 12 }}
              type="inner"
              title={`예매번호: ${b.bookingNumber}`}
            >
              <p>영화: {b.movie.title}</p>
              <p>영화관: {b.showtime.theater}</p>
              <p>
                상영일시:{" "}
                {dayjs(b.showtime.startTime).format("YYYY-MM-DD HH:mm")}
              </p>
              <p>
                좌석:{" "}
                {b.seats.map((s: any) => `${s.row}${s.number}`).join(", ")}
              </p>
              <p>예매일시: {dayjs(b.bookedAt).format("YYYY-MM-DD HH:mm")}</p>
            </Card>
          ))
        )}
      </Card>
    </div>
  );
}
