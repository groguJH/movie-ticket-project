import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import FeedbackAdPresenter from "../../components/presenters/FeedbackAdmin/FeedbackAdPresenter";
import FeedbackDetailContainer from "./FeedbackDetailContainer";
import { useQuery } from "@tanstack/react-query";

/**
 * 관리자 피드백 관리 컨테이너 컴포넌트
 * @description
 * 1. 검색어 입력에 따른 피드백 목록 조회
 * 2. 디바운스 적용으로 input의 불필요한 API 호출 최소화
 * 3. 피드백 데이터 로딩 상태 관리
 * 4. FeedbackAdPresenter 컴포넌트에 필요한 데이터와 핸들러를 전달하여 UI 렌더링
 */

export default function FeedbackAdContainer() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [data, setData] = useState({ items: [], total: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchStats = async () => {
    return axios.get("/api/adminFeedback/stats");
  };
  const { data: stats } = useQuery({
    queryKey: ["feedbackStats"],
    queryFn: fetchStats,
  });

  const statsData = stats?.data;

  const processedStats = useMemo(() => {
    if (!statsData || !statsData.total) return undefined;
    const { status, satisfaction, total } = statsData;

    const StatPercent = (list: any[], id: string) => {
      if (!Array.isArray(list)) return 0;
      const item = list.find((d: any) => d._id === id);
      return item ? Math.round((item.count / total) * 100) : 0;
    };
    const verySatisfied = StatPercent(satisfaction, "매우만족");
    const satisfied = StatPercent(satisfaction, "만족");
    const neutral = StatPercent(satisfaction, "보통");
    const veryUnsatisfied = StatPercent(satisfaction, "매우 불만족");

    const totalSatis = verySatisfied + satisfied;

    return {
      total,
      status: {
        inProgress: StatPercent(status, "in_progress"),
        beforeReply: StatPercent(status, "before reply"),
      },
      satisfaction: {
        verySatisfied,
        satisfied,
        neutral,
        veryUnsatisfied,
      },
      totalSatis: totalSatis,
    };
  }, [statsData]);

  const fetchData = useCallback(
    async (q = debouncedSearch, p = page) => {
      setLoading(true);
      try {
        const res = await axios.get("/api/adminFeedback", {
          params: { search: q, page: p, limit },
        });
        setData(res.data);
      } catch (err) {
        console.error("전체 조회할 수 없습니다.", err);
        setData({ items: [], total: 0, page: 1, limit });
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, page]
  );

  useEffect(() => {
    fetchData(debouncedSearch, page);
  }, [debouncedSearch, page, fetchData]);

  const refreshList = useCallback(() => {
    fetchData(debouncedSearch);
  }, [debouncedSearch, fetchData]);

  return (
    <>
      <FeedbackAdPresenter
        search={search}
        setSearch={setSearch}
        loading={loading}
        data={data}
        page={page}
        setPage={setPage}
        selectedId={selectedId as string}
        onOpenDetail={(selectedId) => setSelectedId(selectedId)}
        processedStats={processedStats}
      />
      {selectedId && (
        <FeedbackDetailContainer
          selectedId={selectedId}
          onClose={() => setSelectedId(null)}
          onRefreshAction={() => {
            refreshList();
            setSelectedId(null);
          }}
        />
      )}
    </>
  );
}
