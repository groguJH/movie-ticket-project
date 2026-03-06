import { Descriptions } from "antd";
import { TvDetail } from "../../../../types/fetchTvList";

export default function TvInfoTb({ tv }: TvDetail) {
  if (!tv) {
    return <div>TV 시리즈 정보를 불러오는 중입니다...</div>;
  }

  const allowedFields = [
    "name",
    "first_air_date",
    "number_of_seasons",
    "number_of_episodes",
    "vote_average",
    "vote_count",
    "status",
    "popularity",
  ] as const;

  const fieldMapping: { [key: string]: string } = {
    name: "제목",
    first_air_date: "첫 방영일",
    number_of_seasons: "시즌 수",
    number_of_episodes: "에피소드 수",
    vote_average: "평균 평점",
    vote_count: "투표 수",
    status: "상태",
    popularity: "인기도",
  };

  return (
    <Descriptions title="TV 시리즈 정보" bordered>
      {allowedFields.map((key) => (
        <Descriptions.Item key={key} label={fieldMapping[key] || key}>
          {/* 어떤 필드는 string이 아닐 수 있으므로 toString()을 붙여주자 */}
          {/* 또한 이 키는 안전하게  */}
          {tv[key] !== undefined ? tv[key].toString() : "정보 없음"}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
}
