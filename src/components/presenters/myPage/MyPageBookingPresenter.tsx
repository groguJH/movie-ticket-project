import React from "react";
import { Seat } from "../../../../types/myPage";
import { Card, CardTitle } from "../../utils/MyPageLayout";
import {
  MovieInfo,
  MovieRunTime,
  MovieTitle,
} from "../../utils/MypageFavLayout";

interface MyPageBookingPresenterProps {
  userId: string;
  movieTitle: string;
  selectedDate: string;
  seats: Seat[];
  children?: React.ReactNode;
  hideGreeting?: boolean;
}

export default function MyPageBookingPresenter({
  userId,
  movieTitle,
  selectedDate,
  seats,
}: MyPageBookingPresenterProps) {
  return (
    <Card style={{ marginBottom: 40 }}>
      <CardTitle>예매번호: {userId}</CardTitle>
      <MovieInfo style={{ marginTop: "1.7rem" }}>
        <MovieTitle> {movieTitle} </MovieTitle>
        <MovieRunTime> 예매 날짜: {selectedDate} </MovieRunTime>
        <MovieRunTime>
          {" "}
          좌석: {seats.map((s) => `${s.row}${s.number}`).join(", ")}{" "}
        </MovieRunTime>
      </MovieInfo>
    </Card>
  );
}
