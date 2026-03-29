"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Movie } from "../../../types/myPage";
import FavListPresenter from "../../components/presenters/favorite/FavListPresenter";
import { Empty, message } from "antd";
import { Divider, OrText } from "../../components/utils/or";
import { useRouter } from "next/router";
import { EmptyMessage } from "../../components/utils/loadingUI";

/**
 *  마이페이지 - 모든 즐겨찾기 목록 컨테이너 컴포넌트
 * @description
 * 1. 사용자 인증 상태를 확인하고, 비로그인 시 메시지 표시
 * 2. React Query를 사용하여 사용자의 즐겨찾기 목록을 비동기 조회
 * 3. 즐겨찾기 삭제 기능을 구현하여 사용자가 목록에서 항목을 제거할 수 있도록 함
 * 4. 즐겨찾기 목록이 있을 경우 MyPageFavListPresenter 컴포넌트에 데이터를 전달하여 UI 렌더링
 * 5. 즐겨찾기 목록이 없을 경우 적절한 메시지와 함께 빈 상태 UI를 표시하며 재시도합니다
 */

export default function FavListContainer() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;
  const router = useRouter();

  const {
    data: favorites,
    isLoading,
    isError,
  } = useQuery<Movie[]>({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      const res = await fetch("/api/favorite/status");
      if (!res.ok) {
        message.error("즐겨찾기 목록을 불러오는 중 오류가 발생했습니다.");
        throw new Error("즐겨찾기 목록 불러오기 실패");
      }
      return res.json();
    },
    enabled: !!userId,
  });

  const handleBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/showtimes/exists?movieId=${bookingId}`);
      const data = await res.json();

      if (!data.canBook) {
        router.push(`/bookPage/${bookingId}?noSchedule=true`);
        return;
      }
      router.push(`/bookPage/${bookingId}`);
    } catch (error) {
      message.error("예매 페이지로 이동하는 중 오류가 발생했습니다.");
      return;
    }
  };

  const mutation = useMutation({
    mutationFn: async (movieId: string) => {
      const res = await fetch("/api/favorite/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });
      if (!res.ok) throw new Error("즐겨찾기 해제에 실패했습니다.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });

  const handleDeleteFavorite = (movieId: string) => {
    mutation.mutate(movieId);
  };

  if (!favorites || favorites.length === 0)
    return (
      <EmptyMessage>
        <p style={{ marginBottom: "20px" }}>즐겨찾기 내역이 없습니다.</p>
        <Empty />
      </EmptyMessage>
    );

  return (
    <>
      {favorites.some((item) => item.mediaType === "movie") && (
        <>
          {favorites
            .filter((item) => item.mediaType === "movie")
            .map((movie) =>
              movie.movieId ? (
                <FavListPresenter
                  key={movie.movieId}
                  movieId={movie.movieId}
                  bookingId={movie._id}
                  movieTitle={movie.movieTitle}
                  moviePost={movie.fullImageUrl}
                  movieRunTime={movie.movieRunTime}
                  mediaType={movie.mediaType}
                  onClickFavorite={() => handleBooking(movie.movieId)}
                  onClickDelete={() => handleDeleteFavorite(movie.movieId)}
                  isLoading={isLoading}
                />
              ) : null,
            )}
        </>
      )}

      {favorites.some((item) => item.mediaType === "on_air_show") && (
        <>
          <Divider style={{ marginTop: "50px" }}>
            <OrText>📺 TV 방송</OrText>
          </Divider>
          {favorites
            .filter((item) => item.mediaType === "on_air_show")
            .map((tv) =>
              tv.movieId ? (
                <FavListPresenter
                  bookingId={tv._id}
                  key={tv.movieId}
                  movieId={tv.movieId}
                  movieTitle={tv.movieTitle}
                  moviePost={tv.fullImageUrl}
                  movieRunTime={tv.movieRunTime}
                  mediaType={tv.mediaType}
                  onClickFavorite={() => handleBooking(tv.movieId)}
                  onClickDelete={() => handleDeleteFavorite(tv.movieId)}
                />
              ) : null,
            )}
        </>
      )}
    </>
  );
}
