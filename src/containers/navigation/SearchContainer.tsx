import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import SearchPresenter from "../../components/presenters/navigation/SearchPresenter";

/**
 * 검색창 컨테이너 컴포넌트
 * @description
 * 1. 사용자의 입력을 받아 디바운스 처리 후 검색 API 호출
 * 2. React Query를 사용하여 검색 결과를 비동기 조회
 * 3. 언마운트 시 디바운스를 정리하여 불필요한 상태 업데이트를 방지
 */
export default function SearchContainer() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const handleResultClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      const res = await axios.get(
        `/api/search?query=${encodeURIComponent(debouncedQuery)}`,
      );
      return res.data.resultData;
    },
    enabled: !!debouncedQuery,
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
