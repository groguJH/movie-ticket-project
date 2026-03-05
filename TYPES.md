# TYPES 변경 내역 (Codex Diff 기준)

목적: 작은 프로젝트 구조를 유지하면서도, 타입 계약(Entity/DTO/ViewModel)이 실제 런타임 데이터와 어긋나지 않도록 정리했습니다.

---

## 1) `types/feedbackModal.ts`

```diff
@@
-/**
- * 피드백 모달 관련 타입 정의 파일
- * @Entity 피드백 데이터베이스 엔티티 정의, 중요한 데이터는 아니라고 생각해서 요청DTO와 동일하게 작성했습니다. responseDTO는 분리합니다.
- * @Response 피드백 응답 DTO 정의
- * @Request 피드백 요청 DTO 정의
- * @UpdateFeedbackRequest 피드백 수정 요청 DTO 정의
- * @description
- *  - 이 파일은 피드백 모달과 관련된 타입들을 정의합니다.
- *  - 피드백 작성, 조회, 수정 등에 사용되는 데이터 구조를 명확히 합니다.
- */
+/**
+ * 피드백 타입 모음(작은 프로젝트용)
+ * 파일 분리는 하지 않되, 한 파일 안에서 Entity / Request DTO / Response DTO를 구분합니다.
+ */
@@
-  _id: string | ObjectId;
+  _id?: string | ObjectId;
@@
-  role: string;
+  role?: string;
@@
+  _id?: string;
@@
-  createdAt: string;
+  createdAt: Date | string;
@@
-  id: string;
```

이유:
- `create` 시점에는 `_id`, `createdAt`이 없기 때문에 optional 처리 필요.
- 실제 API 응답과 타입 불일치(`FeedbackListResponse.id`) 제거.
- `createdAt`은 DB/직렬화 과정에서 `Date | string` 둘 다 올 수 있어 실제 데이터에 맞춤.

---

## 2) `src/services/feedback/FeedbackService.ts`

```diff
@@
 import {
   FeedbackEntity,
+  FeedbackRequest,
   UpdateFeedbackRequest,
 } from "../../../types/feedbackModal";
@@
-export async function CreateFeedbackService(feedback: any) {
+type CreateFeedbackPayload = Omit<FeedbackRequest, "satisfaction"> & {
+  satisfaction: string;
+} &
+  Pick<FeedbackEntity, "userId" | "userName"> &
+  Pick<FeedbackEntity, "status" | "role">;
+
+export async function CreateFeedbackService(feedback: CreateFeedbackPayload) {
```

이유:
- `any` 제거로 서비스 입력 계약을 명확화.
- `FeedbackRequest.satisfaction`은 optional이라 생성 서비스에서는 필수로 재정의.

---

## 3) `src/repositories/feedback/updateFeedback.ts`

```diff
@@
 import {
   FeedbackEntity,
   UpdateFeedbackRequest,
 } from "../../../types/feedbackModal";
+
+type CreateFeedbackInput = Omit<FeedbackEntity, "_id" | "createdAt">;
@@
-export async function createFeedback(feedback: FeedbackEntity) {
+export async function createFeedback(feedback: CreateFeedbackInput) {
```

이유:
- 레포지토리 `insert` 입력은 생성 전 데이터여야 하므로 `_id`, `createdAt` 제외 타입이 맞음.

---

## 4) `types/fetchTvList.ts`

```diff
@@
 export interface TvDetail {
-  tv: TvDetail;
   id: number;
@@
-  imageBaseUrl: string;
@@
-  media_type: string;
+  mediaType: string;
 }
@@
-// TvBanner.tsx도 비슷하게 수정
 export interface TvBannerProps {
   tv: TvDetail;
   imageBaseUrl: string;
 }
+
+export interface TvInfoProps {
+  tv: TvDetail;
+}
```

이유:
- 자기참조(`tv: TvDetail`)는 DTO 구조를 왜곡하므로 제거.
- 실제 API에서 내려주는 필드명(`mediaType`)과 통일.
- `TvInfo` 컴포넌트용 props 타입을 분리해 호출/선언 정합성 확보.

---

## 5) `src/components/presenters/TvList/TvInfo.tsx`

```diff
@@
 import { Descriptions } from "antd";
-import { TvDetail } from "../../../../types/fetchTvList";
+import { TvInfoProps } from "../../../../types/fetchTvList";
 
-export default function TvInfoTb({ tv }: TvDetail) {
+export default function TvInfoTb({ tv }: TvInfoProps) {
```

이유:
- 컴포넌트는 `TvDetail` 전체가 아니라 `{ tv }` props를 받도록 명확히 고침.

---

## 6) `src/containers/tvList/TvDetailListContainer.tsx`

```diff
@@
-import { useState } from "react";
@@
-import {
-  ButtonContainer,
-  CardWrapper,
-  LikeButtonWrapper,
-} from "../../components/utils/MovieDetailLists";
-import { Button } from "antd";
+import { CardWrapper, LikeButtonWrapper } from "../../components/utils/MovieDetailLists";
@@
-              mediaType={tvData.media_type ?? "on_air_show"} // ✅ 추가
+              mediaType={tvData.mediaType ?? "on_air_show"}
@@
-        {tvData && (
-          <TvInfoTb
-            tv={tvData}
-            id={tvData.id}
-            name={tvData.name}
-            overview={tvData.overview}
-            backdrop_path={tvData.backdrop_path}
-            episode_run_time={tvData.episode_run_time}
-            vote_average={tvData.vote_average}
-            vote_count={tvData.vote_count}
-            first_air_date={tvData.first_air_date}
-            status={tvData.status}
-            popularity={tvData.popularity}
-            imageBaseUrl={tvData.imageBaseUrl}
-            number_of_seasons={tvData.number_of_seasons}
-            number_of_episodes={tvData.number_of_episodes}
-            media_type={"on_air_show"}
-          />
-        )}
+        {tvData && <TvInfoTb tv={tvData} />}
```

이유:
- 불필요한 import/props 제거.
- `TvInfoTb` 호출을 단일 props 계약으로 통일.
- `media_type`/`mediaType` 혼용 제거.

---

## 7) `types/fetchMovieBooking.ts`

```diff
@@
 export interface MovieDetail {
-  media_type: string;
-  credits: any;
+  mediaType: string;
+  credits?: {
+    cast: CastMember[];
+  };
```

이유:
- 실제 상세 API(`movies/[id]`)와 필드명 통일 (`mediaType`).
- `credits`를 구조화하여 `any` 제거.

---

## 8) `src/containers/movieList/MovieListDetail.tsx`

```diff
@@
       const crewData: MovieDetail = await creditsRes.json();
-      setCasts(crewData?.credits?.cast);
+      setCasts(crewData?.credits?.cast ?? []);
@@
-              mediaType={movie.media_type ?? "movie"}
+              mediaType={movie.mediaType ?? "movie"}
```

이유:
- `cast`가 없을 때 `undefined` 에러 방지.
- DTO 필드명 변경(`mediaType`) 반영.

---

## 9) `src/components/presenters/movielist/MovieInfoTb.tsx`

```diff
@@
 import { Descriptions } from "antd";
-import type { TableColumnsType } from "antd";
-import styled from "@emotion/styled";
-import {
-  DataType,
-  MovieDetail,
-  MovieInfoTbProps,
-} from "../../../../types/fetchMovieBooking";
+import { MovieDetail, MovieInfoTbProps } from "../../../../types/fetchMovieBooking";
@@
-  ];
+  ] as const;
@@
-  // 테이블 컬럼 헤더이름도 한국어로 변경
-  const columns: TableColumnsType<DataType> = [
-    ...
-  ];
-
-  // 영화 데이터에서 allowedFields만 추출하여 테이블 데이터 생성
-  const dataSource: DataType[] = allowedFields.map((key) => ({
-    key,
-    field: fieldMapping[key] || key,
-    value: movie[key as keyof MovieDetail],
-  }));
@@
-          {movie[key as keyof MovieDetail]}
+          {movie[key]}
```

이유:
- 실제로 사용하지 않는 코드 제거(타입 노이즈/혼란 감소).
- `allowedFields as const`로 안전한 key 추론.
- `movie[key]` 접근 타입 안정화.

---

## 10) `types/nonmember.ts`

```diff
@@
 export interface NonMemberBookingFormValues {
   name: string;
   birth: string;
   phone: string;
   password: string;
-  loading: boolean;
-  onCreate: (values: NonMemberBookingFormValues) => void;
 }
```

이유:
- DTO는 순수 데이터만 가져야 함.
- `loading`, `onCreate`는 UI 상태/행동이므로 Presenter Props로 분리하는 것이 맞음.

---

## 11) `src/components/presenters/non-member/BookingSearchPresenter.tsx`

```diff
@@
 import React from "react";
 import { Card } from "antd";
 import dayjs from "dayjs";
-import { NonMemberBookingFormValues } from "../../../../types/nonmember";
 
 interface PresenterProps {
-  onSearch: (values: NonMemberBookingFormValues) => void;
   error: string | null;
   loading: boolean;
   upcoming: any[];
```

이유:
- 실제 사용하지 않는 props 제거.
- DTO 변경과 함께 Presenter contract 정합성 맞춤.

---

## 12) `src/components/presenters/non-member/GuestBookingPresenter.tsx`

```diff
@@
         <BookingSearchPresenter
           loading={searching}
           error={error}
           upcoming={upcoming}
           past={past}
-          onSearch={() => {}}
         />
```

이유:
- 하위 컴포넌트에서 더 이상 `onSearch`를 요구하지 않으므로 불필요 전달 제거.

---

## 13) `types/movieBooking.ts`

```diff
@@
 export interface Movie {
-  movieTitle: any;
+  movieTitle?: string;
@@
 export interface Showtime {
-  _id: ObjectId; // string에서 ObjectId로 변경
-  movieId: ObjectId | string; // ObjectId 또는 string 허용
-  tmdbId: ObjectId | string;
+  _id: ObjectId | string;
+  movieId: ObjectId | string;
+  tmdbId: number | string;
@@
 export interface BookingReceiptProps {
-  startTime(startTime: any): unknown;
-  _id: string;
+  _id: string | ObjectId;
   showtimeId: string | ObjectId;
+  bookingNumber: string;
   seats: {
-    status: string;
+    status: SeatStatus;
     row: string;
     number: number;
   }[];
   bookedAt: Date;
+  userId?: string | ObjectId | null;
+  guestId?: string | ObjectId | null;
 }
```

이유:
- `any` 제거 및 실제 저장 데이터 구조 반영.
- `startTime(startTime:any)` 같은 함수형 필드는 DTO 성격에 맞지 않아 제거.

---

## 14) `types/myPage.ts`

```diff
@@
 export interface Movie {
   _id: string;
-  bookingId: any;
+  bookingId: string;
   userId: string;
```

이유:
- `any` 제거로 타입 안정성 향상.

---

## 15) `types/movieDetailLists.ts`

```diff
@@
-  credits?: any;
+  credits?: {
+    cast?: {
+      id: number;
+      name: string;
+      character: string;
+      profile_path?: string;
+    }[];
+  };
 }
```

이유:
- `any` 제거 및 영화 상세 응답 구조를 명시.

---

## 타입 검증 결과

- 실행: `yarn tsc --noEmit`
- 결과: 오류 0건

