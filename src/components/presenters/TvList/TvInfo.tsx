import { Descriptions } from "antd";
import { TvInfoProps } from "../../../../types/fetchTvList";

export default function TvInfoTb({ tv }: TvInfoProps) {
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
    <Descriptions
      title="TV 시리즈 정보"
      bordered
      size="small"
      column={{ xs: 1, sm: 2, md: 3 }}
    >
      {allowedFields.map((key) => (
        <Descriptions.Item key={key} label={fieldMapping[key] || key}>
          {tv[key] !== undefined ? tv[key].toString() : "정보 없음"}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
}
