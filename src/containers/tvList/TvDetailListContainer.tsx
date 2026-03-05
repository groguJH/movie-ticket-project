import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { TvDetailProps } from "../../../types/fetchTvList";
import { PageWrapper } from "../../components/utils/MovieCastListLayout";
import {
  CardWrapper,
  LikeButtonWrapper,
} from "../../components/utils/MovieDetailLists";
import FavoriteContainer from "../buttonFavorite/FavoriteContainer";
import TvBanner from "../../components/presenters/TvList/TvBanner";
import TvInfoTb from "../../components/presenters/TvList/TvInfo";
import {
  EmptyMovieList,
  FullPageSkeleton,
} from "../../components/utils/loadingUI";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

/**
 * TV시리즈 상세 조회 컨테이너 컴포넌트
 * @description
 * 1. Next.js 라우터를 사용하여 URL에서 TV 시리즈 ID를 추출
 * 2. React Query를 사용하여 해당 TV 시리즈의 상세 정보를 비동기 조회
 * 3. 조회된 TV 시리즈 정보를 TvBanner 및 TvInfoTb 컴포넌트에 전달하여 UI 렌더링
 * 4. 즐겨찾기 기능을 위한 FavoriteContainer 컴포넌트 포함
 * 5. 로딩 및 에러 상태 처리
 * 6. TV 시리즈는 예매 ID가 없으므로 bookingId는 빈 문자열 전달
 */
export default function TvDetailListContainer() {
  const router = useRouter();
  const { data: session } = useSession();

  const id = typeof router.query.id === "string" ? router.query.id : "";

  const {
    data: tvData,
    isLoading,
    error,
  } = useQuery<TvDetailProps>({
    queryKey: ["tvDetail", id],
    queryFn: async () => {
      const res = await fetch(`/api/TV/${id}`);
      if (!res.ok) {
        throw new Error("TV 시리즈 정보를 가져오는 데 실패했습니다.");
      }
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) return <FullPageSkeleton />;
  if (error) return <EmptyMovieList />;

  return (
    <PageWrapper>
      <CardWrapper>
        {tvData && IMAGE_BASE_URL && (
          <TvBanner tv={tvData} imageBaseUrl={IMAGE_BASE_URL} />
        )}
        <LikeButtonWrapper>
          {tvData && (
            <FavoriteContainer
              movieId={tvData.id.toString()}
              userId={session?.user?.id || "guest"}
              movieTitle={tvData.name}
              moviePost={tvData.backdrop_path}
              movieRunTime={tvData.episode_run_time?.[0] || 0}
              mediaType={tvData.mediaType ?? "on_air_show"}
              bookingId={""}
            />
          )}
        </LikeButtonWrapper>
        {tvData && <TvInfoTb tv={tvData} />}
      </CardWrapper>
    </PageWrapper>
  );
}
