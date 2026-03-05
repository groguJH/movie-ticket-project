# AGENTS (한국어)

## 프로젝트 스냅샷
- 이름: `my-movie-ticket`
- 유형: Next.js 14 Pages Router + TypeScript
- 목적: TMDB + MongoDB 기반 영화/TV 탐색 및 예매 포트폴리오 서비스
- 패키지 매니저: Yarn (`yarn.lock`)
- 핵심 스택: React 18, NextAuth, MongoDB, React Query, Emotion, Ant Design, Recoil, Jest, Playwright, Sentry

## 레이어드 아키텍처
코드 구조:

`Model -> Repository -> Service -> API Route -> Container -> Presenter -> Page`

디렉터리 책임:
- `src/repositories/*`: 영속성/DB 쿼리
- `src/services/*`: 도메인/비즈니스 로직
- `pages/api/*`: HTTP 경계, 요청 검증
- `src/containers/*`: 데이터 패칭 + 상태 오케스트레이션
- `src/components/presenters/*`: 렌더링/UI
- `pages/*`: 페이지 라우트 진입점

## 주요 런타임 진입점
- `pages/_app.tsx`
  - Provider 체인: `SessionProvider -> CacheProvider -> QueryClientProvider -> Antd App -> Navigation`
- `middleware.ts`
  - 인증/관리자 접근 제어 및 `/` 리다이렉트(`reason` 쿼리: `auth`/`admin`)
- `pages/api/auth/[...nextauth].ts`
  - Credentials/Kakao/Naver 인증, JWT/Session 콜백, DB/관리자 이메일 기반 role 매핑
- `lib/mongodb.ts`
  - 공용 MongoDB client promise, 개발환경 전역 재사용, `.env.local` 로드
- `next.config.js`
  - Emotion 설정, antd 계열 transpile, 번들 분석 옵션, Sentry 빌드 래핑
- `instrumentation.ts`
  - 런타임 분기(`nodejs`/`edge`)에 따른 Sentry 초기화

## 핵심 디렉터리 맵
```text
.
|- pages/
|  |- index.tsx, 404.tsx, _app.tsx, _document.tsx, _error.tsx
|  |- authPage/, bookPage/, feedbackAdmin/, moviePage/, mypage/, non-member/, TVbroadcast/
|  |- sentry-example-page.tsx
|  |- api/
|     |- adminFeedback/, auth/, booking/, bookingFetchMovies/, favorite/
|     |- movies/, non-member/, profile/, search/, showtimes/, top-rated/, TV/
|     |- sentry-example-api.ts
|- src/
|  |- components/ (presenters, hoc, utils)
|  |- containers/
|  |- repositories/
|  |- services/ (`src/services/__tests__` 포함)
|- lib/ (mongodb, admin auth/action helper, utils)
|- queries/ (`movieQueries.ts`)
|- scripts/ (`insertMovieData.ts`, `insertFeedbacks.ts`, `run-jest.cjs`)
|- types/ (기능별 타입 정의)
|- tests/ (Playwright 스펙)
|- docs/ (생성된 JSDoc 결과물)
```

## 주요 라우트
- `/`
- `/moviePage`, `/moviePage/[id]`
- `/TVbroadcast`, `/TVbroadcast/[id]`
- `/bookPage`, `/bookPage/[movieId]`
- `/mypage`, `/mypage/edit`, `/mypage/favoriteList`, `/mypage/tickets`, `/mypage/feedback/*`
- `/authPage/signup`
- `/non-member`
- `/feedbackAdmin`
- `/sentry-example-page` (Sentry 샘플 페이지, 일반 비즈니스 플로우 아님)

## API 도메인 맵
- 인증: `pages/api/auth/[...nextauth].ts`, `pages/api/auth/signup.ts`
- TMDB 프록시/검색: `pages/api/movies/*`, `pages/api/TV/*`, `pages/api/search/index.ts`, `pages/api/top-rated/index.tsx`
- 예매/상영: `pages/api/booking/*`, `pages/api/showtimes/*`, `pages/api/bookingFetchMovies/index.ts`
- 비회원 예매 조회/생성: `pages/api/non-member/create.ts`, `pages/api/non-member/search.ts`
- 즐겨찾기: `pages/api/favorite/add.ts`, `remove.ts`, `status.ts`
- 프로필/피드백: `pages/api/profile/update.ts`, `pages/api/profile/feedback/*`
- 관리자 피드백: `pages/api/adminFeedback/*`, `[id]/response/*`, `stats.ts`, `status.ts`
- 관측성 샘플: `pages/api/sentry-example-api.ts` (의도적 테스트 에러 라우트)

## MongoDB 컬렉션 (코드 사용 기준)
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
- 소셜 로그인 고유키는 `SOCIAL_PEPPER_HMAC_SECRET` 기반 해시(`lib/utils/hashSocialID.ts`)
- NextAuth 커스텀 로그인 페이지: `/authPage/signup`
- 미들웨어 매처 현재값: `"/mypage/:path*"`, `"/feedbackAdmin/:path*"`
- 비회원 예매 플로우 허용을 위해 `/bookPage`는 의도적으로 미들웨어 matcher에서 제외
- `PROTECTED_PATHS`에는 `"/bookPage"`가 남아 있으나 matcher 확장 전까지는 실제 보호에 사용되지 않음
- 관리자 API 인가 방식이 혼재:
  - 대부분은 `getServerSession` 인라인 role 체크
  - `pages/api/adminFeedback/status.ts`는 `requireAdminApi`도 병행
- `withAuth` HOC는 일부 mypage 라우트에만 적용되어 보호 전략이 일원화되어 있지 않음

## 데이터 스키마/타입 메모
- 관리자 답변 기준 키는 `response` 배열
- 일부 UI/컨테이너는 하위호환용으로 `responses` fallback 유지
- 미디어 타입 명명 규칙이 소스별로 다름:
  - TMDB 검색/리스트: `media_type`
  - 내부 즐겨찾기/상세 플로우: `mediaType`
- 좌석 상태 값 규칙: `"available"` | `"sold"`
- 예매 정책: API/Repository 양쪽에서 1회 요청당 1좌석(`seats.length === 1`)만 허용

## 환경변수 (코드 기준)
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `KAKAO_CLIENT_ID`
- `KAKAO_CLIENT_SECRET`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_IMAGE_BASE_URL`
- `API_SECRET_KEY`
- `ADMIN_EMAILS`
- `SOCIAL_PEPPER_HMAC_SECRET`
- `SENTRY_DSN`
- `ANALYZE` (옵션)
- `CI` (옵션)
- `NEXT_RUNTIME` (instrumentation 런타임 분기)
- `NODE_ENV`
- `NEXTAUTH_URL` (코드 직접 참조는 적어도 NextAuth 배포/런타임 요구값)

## 실행 명령어
- 개발: `yarn dev`
- 빌드: `yarn build`
- 실행: `yarn start`
- 린트: `yarn lint`
- 타입체크: `yarn tsc --noEmit`
- 단위/서비스 테스트: `yarn test` (`scripts/run-jest.cjs` 래퍼 실행)
- 테스트 watch: `yarn test:watch`
- E2E: `yarn playwright test`
- 영화/상영 시드: `yarn seed`
- 피드백 마이그레이션: `yarn migrate`
- 문서 생성: `yarn jsdoc`

## 테스트 구조
- Jest: `jest.config.cjs`
  - `src/**/*.test.ts` 실행
  - `/tests/`(Playwright) 제외
- Jest 실행 래퍼: `scripts/run-jest.cjs`
  - `strip-ansi` CJS/ESM 호환 문제를 런타임 패치
- Playwright: `playwright.config.ts`
  - 스펙 위치 `tests/` (`auth.middleware.spec.ts`, `example.spec.ts`)
  - 미들웨어 E2E는 `/mypage`, `/feedbackAdmin` 보호 라우트 기준으로 검증

## 관측성
- Sentry 연결 파일:
  - `instrumentation.ts`
  - `instrumentation-client.ts`
  - `sentry.server.config.ts`
  - `sentry.edge.config.ts`
- `next.config.js`에서 `withSentryConfig`로 래핑
- Sentry 터널 경로: `/monitoring`
- Sentry 샘플 테스트 엔드포인트:
  - `pages/sentry-example-page.tsx`
  - `pages/api/sentry-example-api.ts`

## 현재 핫스팟 (정적 분석 맥락)
- API 메서드 가드 응답코드가 여전히 `400`/`405` 혼재
- 관리자 인가 구현이 혼재(`getServerSession` 인라인 체크 vs `requireAdminApi` 래퍼)
- `.env.example`와 실제 코드 사용 키가 불일치:
  - 누락: `API_SECRET_KEY`, `SOCIAL_PEPPER_HMAC_SECRET`, `ADMIN_EMAILS`
  - 잔존: `TMDB_KEY` (현재 코드 경로에서 사용되지 않음)
- `pages/api/sentry-example-api.ts`는 호출 시 의도적으로 에러를 throw하므로 운영 트래픽 경로에서 분리 필요

## 이 저장소 작업 규칙
- 요청이 없으면 Pages Router 패턴 유지
- UI 작업 시 container/presenter 분리 유지
- 비즈니스 로직은 `src/services`, DB 로직은 `src/repositories`
- DB 접근은 `lib/mongodb.ts`의 `clientPromise` 우선 사용
- API 핸들러는 메서드 가드 + 입력 타입 검증을 명시적으로 유지
- 피드백 답변 모델 변경 시 type + repository + container + presenter를 동시 갱신

## 생성물/대용량 디렉터리
필요할 때만 직접 수정:
- `.next/`
- `node_modules/`
- `playwright-report/`
- `test-results/`
- `docs/` (생성물)
