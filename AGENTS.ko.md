# AGENTS (한국어)

## 프로젝트 스냅샷
- 이름: `my-movie-ticket`
- 유형: Next.js 14 Pages Router + TypeScript
- 목적: TMDB + MongoDB 기반 포트폴리오 영화 예매 서비스
- 패키지 매니저: Yarn (`yarn.lock`)
- 핵심 스택: React 18, NextAuth, MongoDB, React Query, Emotion, Ant Design, Jest, Playwright, Sentry

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
  - 인증/관리자 접근 제어 및 `/` 리다이렉트(`reason` 쿼리 사용)
- `pages/api/auth/[...nextauth].ts`
  - Credentials/Kakao/Naver, JWT/Session 콜백, role 매핑
- `lib/mongodb.ts`
  - 공용 MongoDB client promise, 개발환경 전역 재사용, `.env.local` 로드
- `next.config.js`
  - Emotion 설정, antd 계열 transpile, Sentry 래핑, 번들 분석 옵션

## 핵심 디렉터리 맵
```text
.
|- pages/
|  |- index.tsx, 404.tsx, _app.tsx, _document.tsx, _error.tsx
|  |- authPage/, bookPage/, feedbackAdmin/, moviePage/, mypage/, non-member/, TVbroadcast/
|  |- api/
|     |- adminFeedback/, auth/, booking/, bookingFetchMovies/, favorite/
|     |- movies/, non-member/, profile/, search/, showtimes/, top-rated/, TV/
|- src/
|  |- components/ (presenters, hoc, utils)
|  |- containers/
|  |- repositories/
|  |- services/
|- lib/ (mongodb, auth/admin helper, 로깅, utils)
|- queries/
|- scripts/ (seed, migration)
|- tests/ (Playwright)
|- docs/ (jsdoc 생성물)
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

## API 도메인 맵
- 인증: `pages/api/auth/[...nextauth].ts`, `pages/api/auth/signup.ts`
- TMDB 프록시/검색: `pages/api/movies/*`, `pages/api/TV/*`, `pages/api/search/index.ts`, `pages/api/top-rated/index.tsx`
- 예매/상영: `pages/api/booking/*`, `pages/api/showtimes/*`, `pages/api/bookingFetchMovies/index.ts`
- 비회원 예매: `pages/api/non-member/create.ts`, `pages/api/non-member/search.ts`
- 즐겨찾기: `pages/api/favorite/add.ts`, `remove.ts`, `status.ts`
- 프로필/피드백: `pages/api/profile/update.ts`, `pages/api/profile/feedback/*`
- 관리자 피드백: `pages/api/adminFeedback/*`, `[id]/response/*` 포함

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
- 미들웨어 매처 현재값: `"/mypage/:path*"`, `"/feedbackAdmin/:path*"`
- 미들웨어 로직의 `PROTECTED_PATHS`에는 `"/bookPage"`가 있으나 matcher에 `/bookPage`가 없어 현재는 미들웨어 보호가 적용되지 않음
- 관리자 API 인가 방식이 혼재됨:
  - 대부분은 `getServerSession`으로 인라인 role 체크
  - `pages/api/adminFeedback/status.ts`는 `requireAdminApi`도 함께 사용

## 데이터 스키마 메모
- 관리자 답변 필드의 기준 키는 `response` 배열
- 일부 UI/컨테이너는 하위호환용으로 `responses` 키도 fallback 처리
- 답변 키명 변경 시 type + repository + container + presenter를 반드시 동시 변경

## 환경변수 (코드 기준)
- `MONGODB_URI`
- `NEXTAUTH_URL` (배포/런타임 NextAuth 요구)
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
- `NEXT_RUNTIME` (instrumentation 분기)

## 실행 명령어
- 개발: `yarn dev`
- 빌드: `yarn build`
- 실행: `yarn start`
- 린트: `yarn lint`
- 타입체크: `yarn tsc --noEmit` (정적 리뷰 시 자주 사용)
- 단위/서비스 테스트: `yarn test`
- 테스트 watch: `yarn test:watch`
- E2E: `yarn playwright test`
- 영화/상영 시드: `yarn seed`
- 피드백 마이그레이션: `yarn migrate`
- 문서 생성: `yarn jsdoc`

## 테스트 구조
- Jest: `jest.config.cjs`
  - `src/**/*.test.ts` 실행
  - `/tests/`(Playwright) 제외
- Playwright: `playwright.config.ts`
  - 스펙 위치 `tests/`

## 관측성
- Sentry 연결 파일:
  - `instrumentation.ts`
  - `instrumentation-client.ts`
  - `sentry.server.config.ts`
  - `sentry.edge.config.ts`
- `next.config.js`에서 `withSentryConfig`로 래핑
- Sentry 터널 경로: `/monitoring`

## 현재 핫스팟 (정적 분석 맥락)
- API 메서드 가드 응답코드가 `400`/`405` 혼재
- `pages/api/booking/index.ts`의 POST 메서드 가드가 주석 처리 상태
- `pages/api/showtimes/[id]/seat.ts`는 메서드/ID 검증 가드가 없음
- 일부 환경에서 Jest가 테스트 실행 전 `TypeError: stripAnsi is not a function`으로 실패
- `.env.example`에 코드 사용 키 일부 누락 (`API_SECRET_KEY`, `SOCIAL_PEPPER_HMAC_SECRET`, `ADMIN_EMAILS`)

## 이 저장소 작업 규칙
- 요청이 없으면 Pages Router 패턴 유지
- UI 작업 시 container/presenter 분리 유지
- 비즈니스 로직은 `src/services`, DB 로직은 `src/repositories`
- DB 접근은 `lib/mongodb.ts`의 `clientPromise` 우선 사용
- API 핸들러는 메서드 가드 + 입력 타입 검증을 명시적으로 유지

## 생성물/대용량 디렉터리
필요할 때만 직접 수정:
- `.next/`
- `node_modules/`
- `playwright-report/`
- `test-results/`
- `docs/` (생성물)
