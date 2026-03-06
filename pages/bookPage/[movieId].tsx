import React from "react";
import BookingContainer from "../../src/containers/booking/BookingContainer";
import { useRouter } from "next/router";
import { InlineSmallSpinner } from "../../src/components/utils/loadingUI";

export default function BookingPage() {
  const router = useRouter();
  const movieId = router.query.movieId as string; // URL에서 movieId 가져오기
  const noSchedule = router.query.noSchedule === "true"; // 쿼리 파라미터에서 noSchedule 확인

  if (!router.isReady || !movieId) return <InlineSmallSpinner />; // 로딩 상태 표시

  return (
    <section>
      <BookingContainer movieId={movieId} hasNoScheduleFromPage={noSchedule} />
    </section>
  );
}
