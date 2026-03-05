import React from "react";
import BookingContainer from "../../src/containers/booking/BookingContainer";
import { useRouter } from "next/router";
import { InlineSmallSpinner } from "../../src/components/utils/loadingUI";

export default function BookingPage() {
  const router = useRouter();
  const movieId = router.query.movieId as string;
  const noSchedule = router.query.noSchedule === "true";

  if (!router.isReady || !movieId) return <InlineSmallSpinner />;

  return (
    <section>
      <BookingContainer movieId={movieId} hasNoScheduleFromPage={noSchedule} />
    </section>
  );
}
