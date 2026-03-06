import { useEffect, useState } from "react";
import TopRatedPresenter from "../../components/presenters/top-rated/TopRatedPresenter";

export interface TopRatedMovies {
  id: number;
  title: string;
  overview: string;
  popularity: number;
  key: string | null;
}

/**
 * 상위 인기 영화 트레일러 컨테이너 컴포넌트
 * @description
 * 1. API요청하여 상위 5개의 인기 영화 데이터를 비동기 조회
 * 2. 조회된 영화 데이터를 TopRatedPresenter 컴포넌트에 전달하여 UI 렌더링
 * 3. 사용자가 영화를 클릭할 때 선택된 영화의 트레일러를 표시
 */

export default function TopRatedContainer() {
  const [Movies, setMovies] = useState<TopRatedMovies[]>([]);
  const [selectedList, SetSelectedList] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/top-rated")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          console.error("API 오류 발생", data);
        }
      });
  }, []);

  return (
    <>
      <TopRatedPresenter
        movies={Movies}
        selectedList={selectedList}
        SetSelectedList={SetSelectedList}
      />
    </>
  );
}
