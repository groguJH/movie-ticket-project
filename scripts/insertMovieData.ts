import "dotenv/config";
import { ObjectId } from "mongodb";
import fetch from "node-fetch";
import clientPromise from "../lib/mongodb";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_SECRET_KEY = process.env.API_SECRET_KEY;

/**
 * 영화 및 상영관 데이터를 MongoDB에 삽입하는 스크립트입니다.
 * 데이터 시딩을 위해 사용됩니다.
 * 일주일치 상영관 데이터와 일부 예매된 데이터도 함께 생성합니다.
 */

const seatBooking = () => {
  const seats = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  for (let row of rows) {
    for (let num = 1; num <= 7; num++) {
      seats.push({ row, number: num, status: "available" });
    }
  }
  return seats;
};

const getRandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

async function insertMovieData() {
  const client = await clientPromise;
  const db = client.db("mymovieticket");

  const res = await fetch(
    `${API_URL}movie/popular?api_key=${API_SECRET_KEY}&language=ko-KR&page=1`,
  );
  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.status}`);
  }
  const data = await res.json();
  const movieData = data.results.slice(0, 12);

  const movies = movieData.map((m: any) => ({
    _id: new ObjectId(),
    tmdbId: m.id,
    title: m.title,
    overview: m.overview,
    backdropPath: m.backdrop_path,
    releaseDate: new Date(m.release_date),
  }));

  const screenings: any[] = [];
  const stationArr = [
    "강남역 영화관",
    "금천구청역 영화관",
    "홍대입구역 영화관",
    "신촌역 영화관",
    "건대입구역 영화관",
  ];

  movies.forEach((m: any) => {
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const base = new Date();
      base.setDate(base.getDate() + dayOffset);
      const startWindow = new Date(base).setHours(9, 0, 0, 0);
      const endWindow = new Date(base).setHours(20, 0, 0, 0);

      stationArr.forEach((theaterName) => {
        const randomTime = getRandomDate(
          new Date(startWindow),
          new Date(endWindow),
        );
        screenings.push({
          _id: new ObjectId(),
          movieId: m._id,
          tmdbId: String(m.tmdbId),
          date: new Date(base.setHours(0, 0, 0, 0)),
          theater: theaterName,
          screen: "1관",
          startTime: randomTime,
          seats: seatBooking(),
        });
      });
    }
  });

  const bookings = screenings.slice(0, 1).map((s: { _id: any }) => ({
    _id: new ObjectId(),
    userId: null,
    showtimeId: s._id,
    seats: [{ row: "A", number: 1, status: "sold" }],
    bookedAt: new Date().toISOString(),
  }));

  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      await db.collection("movie_movies").deleteMany({}, { session });
      await db.collection("movie_screenings").deleteMany({}, { session });
      await db.collection("movie_bookings").deleteMany({}, { session });

      // 2. 새로운 데이터 삽입 (트랜잭션 안에서만 수행)
      await db.collection("movie_movies").insertMany(movies, { session });
      await db
        .collection("movie_screenings")
        .insertMany(screenings, { session });
      await db.collection("movie_bookings").insertMany(bookings, { session });
    });
    console.log("데이터 트랜잭션 완료: 정상적으로 데이터 교체 성공");
  } catch (err) {
    console.error("트랜잭션 실패: DB 상태는 이전과 동일하게 유지됩니다.", err);
    throw err;
  } finally {
    await session.endSession();
    await client.close();
  }
}

insertMovieData().catch((err) => {
  console.error("스크립트 실행 중 오류 발생:", err);
  process.exit(1);
});
