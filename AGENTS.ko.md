# AGENTS (한국어)

## 프로젝트 요약

- 이름: `my-movie-ticket`
- 유형: TypeScript 기반 Next.js 14 Pages Router 앱
- 목적: TMDB 데이터를 활용한 포트폴리오용 영화 예매 서비스
- 핵심 스택: React 18, NextAuth, MongoDB, React Query, Emotion, Ant Design, Playwright, Jest
- 패키지 매니저: Yarn (`yarn.lock` 존재)

## 아키텍처 패턴

이 저장소는 아래 계층 구조를 따릅니다.

`Model -> Repository -> Service -> API Route -> Container -> Presenter -> Page`

실제 디렉터리 매핑:

- `src/repositories/*`: DB 접근 및 영속성 쿼리
- `src/services/*`: 비즈니스/도메인 로직
- `pages/api/*`: HTTP 경계, 요청 검증
- `src/containers/*`: 데이터 패칭 및 상태 오케스트레이션
- `src/components/presenters/*`: UI 렌더링
- `pages/*`: 라우트 진입점

## 주요 런타임 진입점

- `pages/_app.tsx`
  - Provider 순서: `SessionProvider` -> Emotion `CacheProvider` -> `QueryClientProvider` -> Antd `App` -> `Navigation`
- `middleware.ts`
  - 보호 경로의 미인증 사용자 리다이렉트
- `pages/api/auth/[...nextauth].ts`
  - NextAuth Provider(Credentials/Kakao/Naver), JWT/Session 콜백, 역할(role) 매핑
- `lib/mongodb.ts`
  - 개발 환경 핫리로드 재사용을 고려한 공용 MongoDB client promise
- `next.config.js`
  - Emotion 컴파일러 설정, antd transpile 설정, Sentry 래핑, 번들 분석 옵션

## 디렉터리 맵 (핵심)

```text
.
|- pages/
|  |- index.tsx
|  |- moviePage/, TVbroadcast/, bookPage/, mypage/, feedbackAdmin/, authPage/, non-member/
|  |- api/
|     |- auth/, movies/, TV/, showtimes/, booking/, bookingFetchMovies/
|     |- favorite/, profile/, adminFeedback/, non-member/, search/, top-rated/
|- src/
|  |- components/
|  |  |- presenters/ (기능 UI)
|  |  |- hoc/ (`Seo.tsx`, `withAuth.tsx`)
|  |  |- utils/
|  |- containers/ (상태 + 사이드이펙트)
|  |- services/ (비즈니스 로직)
|  |- repositories/ (MongoDB 접근)
|- lib/
|  |- mongodb.ts, requireAdminApi.ts, logAdminAction.ts
|  |- utils/
|- queries/
|  |- movieQueries.ts
|- types/
|- scripts/
|  |- insertMovieData.ts, insertFeedbacks.ts
|- tests/ (Playwright e2e)
|- docs/ (JSDoc 생성 결과)
```

## 주요 사용자 라우트 (Pages Router)

- `/` 홈 (캐러셀 + top-rated + 도움말 모달)
- `/moviePage`, `/moviePage/[id]`
- `/TVbroadcast`, `/TVbroadcast/[id]`
- `/bookPage`, `/bookPage/[movieId]`
- `/mypage`, `/mypage/edit`, `/mypage/favoriteList`, `/mypage/tickets`, `/mypage/feedback/*`
- `/authPage/signup`
- `/non-member`
- `/feedbackAdmin`

## API 도메인 구성

- 인증(Auth)
  - `pages/api/auth/[...nextauth].ts`
  - `pages/api/auth/signup.ts`
- TMDB 프록시/검색
  - `pages/api/movies/*`, `pages/api/TV/*`, `pages/api/search/index.ts`, `pages/api/top-rated/index.tsx`
- 예매(Booking)
  - `pages/api/booking/index.ts`, `pages/api/booking/[id].ts`, `pages/api/booking/myPageList.ts`
  - `pages/api/showtimes/index.ts`, `pages/api/showtimes/exists.ts`, `pages/api/showtimes/[id]/seat.ts`
  - `pages/api/bookingFetchMovies/index.ts`
- 비회원 예매 생성/조회
  - `pages/api/non-member/create.ts`, `pages/api/non-member/search.ts`
- 즐겨찾기
  - `pages/api/favorite/add.ts`, `remove.ts`, `status.ts`
- 프로필/피드백
  - `pages/api/profile/update.ts`
  - `pages/api/profile/feedback/index.ts`, `pages/api/profile/feedback/edit/[id].ts`
- 관리자 피드백
  - `pages/api/adminFeedback/index.ts`, `stats.ts`, `status.ts`, `[id].ts`, `[id]/response/*`

## 사용 중인 MongoDB 컬렉션

- `users`
- `movie_movies`
- `movie_screenings`
- `movie_bookings`
- `favoriteMovies`
- `feedback`
- `non-member-user`
- `adminActions`

## 인증/인가 메모

- 세션 전략: JWT (`next-auth`)
- 역할: `user`, `admin`
- 미들웨어(`middleware.ts`) 매처: `"/mypage/:path*"`, `"/admin/:path*"`
- 일부 관리자 API는 `requireAdminApi`를 사용하고, 일부는 핸들러 내부 세션 체크에 의존

## 환경변수 (코드 기준)

필수/사용 중:

- `MONGODB_URI`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `KAKAO_CLIENT_ID`
- `KAKAO_CLIENT_SECRET`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_IMAGE_BASE_URL`
- `API_SECRET_KEY`
- `SENTRY_DSN`
- `SOCIAL_PEPPER_HMAC_SECRET`
- `ADMIN_EMAILS`
  선택/빌드 시:
- `ANALYZE`
- `CI`

## 실행 명령어

- 개발 서버: `yarn dev`
- 빌드: `yarn build`
- 실행: `yarn start`
- 린트: `yarn lint`
- 단위/서비스 테스트(Jest): `yarn test`
- 테스트 watch: `yarn test:watch`
- E2E 테스트(Playwright): `yarn playwright test`
- 영화/상영 데이터 시드: `yarn seed`
- 피드백 마이그레이션/인덱스 준비: `yarn migrate`
- 문서 생성: `yarn jsdoc`

## 테스트 구조

- Jest 설정: `jest.config.cjs`
  - `src/**/*.test.ts` 실행
  - `/tests/`(Playwright 스펙) 제외
- Playwright 설정: `playwright.config.ts`
  - 스펙 위치: `tests/`
  - CI 워크플로우: `.github/workflows/playwright.yml`

## 관측성(Observability)

- Sentry 적용 파일:
  - `instrumentation.ts`
  - `instrumentation-client.ts`
  - `sentry.server.config.ts`
  - `sentry.edge.config.ts`
- `next.config.js`에서 `withSentryConfig`로 빌드 래핑, 터널 경로 `/monitoring` 사용

## 이 저장소 작업 규칙(에이전트 기준)

- Pages Router 규칙 유지, 요청이 없으면 App Router 패턴 도입 금지
- UI 작업 시 container/presenter 분리 유지
- 비즈니스 로직은 `src/services`, DB 로직은 `src/repositories`에 유지
- DB 변경 시 `lib/mongodb.ts`의 `clientPromise` 사용
- API 라우트는 현재 스타일(메서드 가드 + 타입 검증) 유지

## 리팩터링 전 확인할 불일치/갭

- 인증 라우트 명이 혼재됨 (`/authPage/signup` 존재, 일부 코드에서 `/auth/signup` 또는 `/auth/signin` 참조)
- 미들웨어는 `/admin/*` 보호인데 관리자 UI 페이지는 `/feedbackAdmin`
- `pages/api` 하위 일부 파일이 `.tsx` 확장자 사용(예: `top-rated/index.tsx`)
- `.env.example`에 코드 사용 환경변수 일부 누락 (`API_SECRET_KEY`, `SOCIAL_PEPPER_HMAC_SECRET`, `ADMIN_EMAILS`)

## 생성물/대용량 디렉터리

아래는 필요 시에만 직접 수정:

- `.next/`
- `node_modules/`
- `playwright-report/`
- `test-results/`
- `docs/` (생성 결과)
