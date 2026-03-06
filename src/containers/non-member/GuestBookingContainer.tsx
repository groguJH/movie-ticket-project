import { useRouter } from "next/router";
import { JSX, useState } from "react";
import { NonMemberBookingFormValues } from "../../../types/nonmember";
import { GuestBookingPresenter } from "../../components/presenters/non-member/GuestBookingPresenter";

export default function GuestBookingContainer(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 검색 관련 상태
  const [searching, setSearching] = useState(false);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { movieId } = router.query;

  // 기존: 비회원 생성 후 bookPage로 이동 (guestId 포함)
  const handleFinish = async (values: NonMemberBookingFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/non-member/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("비회원 생성에 실패했습니다.");

      const data = await res.json();
      const nonBookingId = data.nonMemberId as string;

      if (!nonBookingId) {
        throw new Error("서버 응답에 nonBookingId가 없습니다.");
      }
      // 세션 스토리지에 nonBookingId 저장 (탭 닫으면 삭제)
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("nonBookingId", nonBookingId);
        } catch (e) {
          console.warn("sessionStorage 사용 실패:", e);
        }
      }

      // 원래 flow 유지: /bookPage로 이동하되 쿼리스트링에 bookingId 추가
      const rawReturnTo = (router.query.returnTo as string) || "/bookPage";

      console.log("rawReturnTo:", rawReturnTo);
      const [queryString] = rawReturnTo.split("?");

      const params = new URLSearchParams(queryString || "");
      params.set("bookingId", nonBookingId);
      const bookPage = "bookPage";
      const finalUrl = `${bookPage}?${params.toString()}`;

      await router.push(finalUrl);
    } catch (err) {
      console.error("비회원 예매 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 새로 추가: 검색(onSearch) 핸들러
  const handleSearch = async (values: NonMemberBookingFormValues) => {
    setSearching(true);
    setSearchError(null);
    try {
      const res = await fetch("/api/non-member/search", {
        method: "POST", // 반드시 POST (민감 정보이므로)
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || "조회 실패");
      }

      const data = await res.json();
      setUpcoming(data.upcoming || []);
      setPast(data.past || []);
    } catch (err: any) {
      console.error("비회원 조회 오류:", err);
      setSearchError(err.message || "조회 중 오류 발생");
    } finally {
      setSearching(false);
    }
  };

  return (
    <GuestBookingPresenter
      onCreate={handleFinish}
      onSearch={handleSearch}
      loading={loading}
      searching={searching}
      upcoming={upcoming}
      past={past}
      error={searchError}
    />
  );
}
