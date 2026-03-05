import { useEffect, useState } from "react";
import { TvDataRequest, TvListPresenterProps } from "../../../types/tvList";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import TvListPresenter from "../../components/presenters/TvList/TvListPresenter";
import {
  EmptyMovieList,
  FullPageSkeleton,
} from "../../components/utils/loadingUI";
import { message } from "antd";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL as string;

/**
 * TV 리스트 컨테이너 컴포넌트
 * @description
 * 1. 무한 스크롤을 통한 TV 데이터 페칭
 * 2. 중복 데이터 제거 로직 포함
 * 3. TvListPresenter 컴포넌트에 필요한 데이터와 핸들러를 전달하여 UI 렌더링
 * 4. 로딩 및 에러 상태 처리하였습니다.
 */

export default function TvListContainer() {
  const [TvImage, setTvImage] = useState<TvDataRequest | null>(null);
  const [TvInfo, setTvInfo] = useState<TvDataRequest[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery<TvListPresenterProps>({
    queryKey: ["tvData"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get(`/api/TV?page=${pageParam}`);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.page && lastPage?.page < lastPage?.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (!data) return;
    const allTvItems = data.pages.flatMap((page) => page.results);
    const existingIds = new Set(TvInfo.map((item) => item.id));
    const newTvItems = allTvItems.filter((item) => !existingIds.has(item.id));

    if (newTvItems.length > 0) {
      setTvInfo((prev) => [...prev, ...newTvItems]);
    }

    if (!TvImage && allTvItems.length > 0) {
      setTvImage(allTvItems[0]);
    }
  }, [data, TvImage, TvInfo]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !isFetching &&
        hasNextPage
      ) {
        fetchNextPage();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasNextPage, fetchNextPage]);

  if (isLoading && TvInfo.length === 0) {
    return <FullPageSkeleton />;
  }

  if (error) {
    message.error("TV 목록을 불러오는 중 오류가 발생했습니다.");
    return <EmptyMovieList />;
  }
  return (
    <div>
      <TvListPresenter
        TvImage={TvImage}
        TvInfo={TvInfo}
        isFetching={isFetching}
        imageBaseUrl={IMAGE_BASE_URL}
        page={0}
        total_pages={0}
        results={[]}
      />
    </div>
  );
}
