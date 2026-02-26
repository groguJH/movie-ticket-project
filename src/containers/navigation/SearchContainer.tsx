import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import SearchPresenter from "../../components/presenters/navigation/SearchPresenter";
import { useRouter } from "next/router";

/**
 * 검색창 컨테이너 컴포넌트
 * @props { onSearchClick: () => void } onSearchClick - 검색창 토글 핸들러
 * @description
 * 1. 사용자의 입력을 받아 디바운스 처리 후 검색 API 호출
 * 2. React Query를 사용하여 검색 결과를 비동기 조회
 * 3. 라우팅 이벤트를 감지하여 페이지 이동 시 검색어 및 결과 초기화
 */
export default function SearchContainer({
  onSearchClick,
}: {
  onSearchClick: () => void;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const router = useRouter();

  // 💡 debounce + useCallback으로 메모이제이션
  const handleDebounce = useCallback(
    _.debounce((val: string) => {
      setDebouncedQuery(val);
    }, 300),
    [],
  );

  // 🔄 라우팅 시작 시 검색어 & 결과 초기화
  useEffect(() => {
    const handleRouteChange = () => {
      setQuery(""); // 😊 검색어 클리어
      setDebouncedQuery("");
      onSearchClick(); // ✨ 검색창 닫기
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events, onSearchClick]);

  // input 입력 핸들러
  const handleResultClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputData = e.target.value;
    setQuery(inputData);
    handleDebounce(inputData); // lodash debounce 사용
    // onSearchClick();
  };

  // 🎯 queryKey는 반드시 debounce된 값만 사용
  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      const res = await axios.get(
        `/api/search?query=${encodeURIComponent(debouncedQuery)}`,
      );
      return res.data.resultData;
    },
    enabled: !!debouncedQuery, // 빈 문자열이면 호출 금지
    staleTime: 1000 * 60,
  });

  return (
    <SearchPresenter
      query={query}
      handleResultClick={handleResultClick}
      results={data ?? []}
      loading={isLoading}
      onSearch={() => {}}
    />
  );
}
