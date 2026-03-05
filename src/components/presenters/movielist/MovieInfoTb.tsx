import { Descriptions } from "antd";
import { MovieDetail, MovieInfoTbProps } from "../../../../types/fetchMovieBooking";

export default function MovieInfoTb({ movie }: MovieInfoTbProps) {
  if (!movie) {
    return <div>영화 정보를 불러오는 중입니다...</div>;
  }

  // 출력할 필드 목록
  const allowedFields = [
    "title",
    "runtime",
    "vote_count",
    "release_date",
    "revenue",
    "vote_average",
    "status",
    "popularity",
  ] as const;

  // 각 필드에 대한 한글 라벨 매핑
  const fieldMapping: { [key: string]: string } = {
    title: "제목",
    release_date: "개봉일",
    revenue: "매출",
    runtime: "상영 시간",
    vote_average: "평균 평점",
    vote_count: "투표 수",
    status: "상태",
    popularity: "인기도",
  };

  return (
    <Descriptions title="Movie Info" bordered>
      {allowedFields.map((key) => (
        <Descriptions.Item key={key} label={fieldMapping[key] || key}>
          {movie[key]}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
}
