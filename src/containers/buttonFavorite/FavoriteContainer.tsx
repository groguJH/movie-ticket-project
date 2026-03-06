import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ButtonFavoritePresenter from "../../components/presenters/favorite/ButtonFavoritePresenter";
import { FavoriteProps } from "../../../types/favoriteButton";

/**
 *
 * 좋아요(즐겨찾기) 버튼 컨테이너 컴포넌트
 * @props { movieId: string; movieTitle: string; moviePost: string; movieRunTime: number; mediaType: string }
 * @description
 * 1. 즐겨찾기 목록을 조회합니다
 * 2. 좋아요 버튼을 클릭하면 좋아요 추가/제거 API 호출합니다
 * 3. 좋아요 상태와 좋아요 수를 실시간으로 업데이트 합니다
 */
export default function FavoriteContainer({
  movieId,
  movieTitle,
  moviePost,
  movieRunTime,
  mediaType,
}: FavoriteProps) {
  const [favoriteNumber, setFavoriteNumber] = useState<number>(0);
  const [favorited, setFavorited] = useState<boolean>(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchFavoriteStatus = async () => {
      const res = await fetch("/api/favorite/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });
      const data = await res.json();
      if (data.success) {
        setFavorited(data.favorited);
        setFavoriteNumber(data.favoriteNumber);
      }
    };

    fetchFavoriteStatus();
  }, [movieId, status]);

  const handleClick = async () => {
    if (!session?.user?.id) return;

    const url = favorited ? "/api/favorite/remove" : "/api/favorite/add";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movieId,
        movieTitle,
        moviePost,
        movieRunTime,
        mediaType,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setFavorited(!favorited);
      setFavoriteNumber(data.favoriteNumber);
    }
  };

  if (status !== "authenticated") return null;

  return (
    <ButtonFavoritePresenter isFavorited={favorited} onClick={handleClick} />
  );
}
