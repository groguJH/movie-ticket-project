# 🎬 TMDB API 기반 영화 예매 웹 서비스

![홈페이지 녹화](https://velog.velcdn.com/images/jh_000velog/post/125422bb-2d21-4083-97cc-badc46cc6ca4/image.gif)

## 목차

- 프로젝트 개요
- 기술 스택
- 설계 구조
- 폴더 구조
- 핵심 기능
- 주요 API 엔드포인트 요약
- 유저 플로우 요약 (Mermaid)
- 인증 • 보안 설계
- 실행 방법
- 향후 개선 사항
- 라이선스
  <br/>
  <br/>

### 프로젝트 개요

신입 프론트엔드 포트폴리오용 프로젝트입니다.  
TMDB API로 영화/TV를 검색·탐색하고 회원·비회원 예매, 즐겨찾기, 마이페이지, 피드백(사용자/관리자)을 구현한 애플리케이션입니다.
<br/>
현재 코드는 Pages Router 기반의 레이어드 구조(Repository/Service/API/Container/Presenter)로 정리되어 있으며,
회원/비회원 흐름을 모두 고려한 예매 경험을 목표로 설계되어 있습니다.
<br/>
예매 정책은 현재 1회 요청당 1좌석(`seats.length === 1`)입니다.
<br/>
([포트폴리오 사이트 보러가기](https://movie-ticket-project-theta.vercel.app/))
<br/>

### 기술 스택

<!-- 아이콘 첨부 -->

**Frontend**

- Next.js (pages router)<img src="https://img.shields.io/badge/v14-version?style=plastic&logo=nextdotjs&logoColor=ffffff&label=Nextjs&labelColor=black&color=black
  "/>
- TypeScript<img src="https://img.shields.io/badge/v5.8.3-blue?style=plastic&logo=TypeScript&logoColor=%233178C6&label=TypeScript&labelColor=blue&color=blue

  "/>

- React Query<img src="https://img.shields.io/badge/v5.71.5-red?style=plastic&logo=React%20Query&logoColor=%23FF4154&label=React%20Query&labelColor=red&color=red"/>
- Emotion (styled)<img src="https://img.shields.io/badge/v11.14.0-pink?style=plastic&logo=styled-components&logoColor=%23DB7093&label=styled-components&labelColor=pink&color=pink"/>

**Backend**

- Next.js API Routes<img src="https://img.shields.io/badge/v14-version?style=plastic&logo=nextdotjs&logoColor=ffffff&label=Nextjs&labelColor=black&color=black"/>
- MongoDB<img src="https://img.shields.io/badge/v6.15.0-green?style=plastic&logo=MongoDB&logoColor=%2347A248&label=MongoDB&labelColor=green&color=green"/>
- NextAuth (Credentials / Kakao / Naver)<img src="https://img.shields.io/badge/v4.24.11-blue?style=plastic&logo=next-auth&logoColor=blue&label=next-auth&labelColor=blue&color=blue"/>

**ETC**

- TMDB API<img src="https://img.shields.io/badge/TMDB-blue?style=plastic&logo=The%20Movie%20Database&logoColor=%2301B4E4&label=The%20Movie%20Database&labelColor=blue&color=blue"/>
- Yarn<img src="https://img.shields.io/badge/-blue?style=plastic&logo=Yarn&logoColor=%232C8EBB&label=Yarn&labelColor=blue&color=blue">
- Vercel 배포<img src="https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white"/>

  <br/>
  <br/>

### 설계 구조

본 프로젝트는 유지보수와 확장성을 고려하여 레이어드 아키텍처와
Container/Presenter 패턴을 결합하여 설계되었습니다.

```
Model
 → Repository
   → Service
     → API Route
       → Container
         → Presenter
           → Page

```

- Container: 데이터 요청, 상태 관리(핸들러 등...) 담당
- Presenter: UI 렌더링 담당
- Service/Repository: 비즈니스 로직과 DB 접근 로직 분리
- API Route: 요청 검증 및 HTTP 경계 처리

- Container/Presenter 패턴을 사용한 이유
  - 데이터 처리 로직과 UI 렌더링 책임을 분리해 컴포넌트 재사용성과 유지보수성을 높이기 위함입니다.
  - Presenter를 순수 UI 컴포넌트로 두어 변경 영향 범위를 줄이고 테스트 관점을 명확히 가져가기 위함입니다.

- React Query를 사용한 이유
  - 서버 상태 캐싱/동기화/재요청 제어를 일관된 방식으로 처리해 API 호출 비용과 상태 관리 복잡도를 줄이기 위함입니다.
  - 로딩/에러/갱신 상태를 표준화해 사용자 경험과 개발 생산성을 함께 확보하기 위함입니다.

- NextAuth를 사용한 이유
  - Credentials와 소셜 로그인(Kakao/Naver)을 하나의 인증 프레임워크 안에서 통합 관리해 인증 흐름을 단순화하기 위함입니다.
  - JWT 세션 전략과 콜백 기반 사용자/권한(role) 확장을 통해 포트폴리오에서 인증/인가 구조를 명확히 보여주기 위함입니다.

- MongoDB를 사용한 이유
  - 예매, 좌석, 피드백, 즐겨찾기처럼 성격이 다른 데이터를 유연한 스키마로 빠르게 모델링하기 위함입니다.
  - Repository 계층과 함께 사용해 컬렉션 단위의 책임 분리와 기능 확장(조회/통계/마이그레이션)을 용이하게 하기 위함입니다.

- Sentry를 사용한 이유
  - 클라이언트/서버/엣지에서 발생하는 오류를 한 곳에서 수집해 문제 재현과 원인 파악 시간을 줄이기 위함입니다.
  - 포트폴리오에서도 실제 운영을 고려한 모니터링/관측성 설계를 포함하고 있음을 보여주기 위함입니다.

<br/>
<br/>

### 📁폴더 구조

```
pages/
├── index.tsx # 메인 페이지
│
├── moviePage/ # 영화 관련 페이지
│ ├── index.tsx # 영화 목록
│ └── [id].tsx # 영화 상세 페이지
│
├── TVbroadcast/ # TV 방송 관련 페이지
│ ├── index.tsx # TV 방송 목록
│ └── [id].tsx # TV 방송 상세 페이지
│
├── bookPage/ # 예매 페이지
│ ├── index.tsx # 예매 진입 페이지
│ └── [movieId].tsx # 영화 예매 진행 페이지
│
├── mypage/ # 마이페이지
│ ├── index.tsx # 마이페이지 메인
│ ├── edit.tsx # 개인정보 수정
│ ├── favoriteList.tsx # 즐겨찾기 목록
│ ├── tickets.tsx # 예매 내역
│ └── feedback/ # 사용자 피드백
│   ├── index.tsx # 피드백 목록
│   └── write.tsx # 피드백 작성
│
├── authPage/ # 회원가입/로그인 진입
│ └── signup.tsx
│
├── non-member/ # 비회원 예매 조회/진입
│ └── index.tsx
│
├── feedbackAdmin/ # 관리자 피드백 관리 페이지
│ └── index.tsx
│
├── api/ # 서버(API Routes)
│ ├── auth/ # 인증 / 회원가입
│ │ ├── [...nextauth].ts # NextAuth 설정
│ │ └── signup.ts # 회원가입 API
│ │
│ ├── movies/ # 영화 데이터 API (TMDB)
│ │ ├── fetchMovies.ts
│ │ └── [id].ts
│ │
│ ├── TV/ # TV 데이터 API (TMDB)
│ │ ├── index.ts
│ │ └── [id].ts
│ │
│ ├── booking/ # 예매 관련 API
│ │ ├── index.ts # 예매 생성(회원/비회원, 1좌석 정책)
│ │ ├── [id].ts # 예매 상세/영수증
│ │ └── myPageList.ts # 마이페이지 예매 목록
│ │
│ ├── bookingFetchMovies/ # 예매용 영화 데이터
│ │ └── index.ts
│ │
│ ├── showtimes/ # 상영 정보 / 좌석
│ │ ├── index.ts
│ │ ├── exists.ts
│ │ └── [id]/
│ │   └── seat.ts
│ │
│ ├── favorite/ # 즐겨찾기 API
│ │ ├── add.ts
│ │ ├── remove.ts
│ │ └── status.ts
│ │
│ ├── profile/ # 마이페이지 / 프로필
│ │ ├── update.ts
│ │ └── feedback/
│ │   ├── index.ts
│ │   └── edit/[id].ts
│ │
│ ├── adminFeedback/ # 관리자 피드백 API
│ │ ├── index.ts
│ │ ├── [id].ts
│ │ ├── stats.ts
│ │ ├── status.ts
│ │ └── [id]/response/
│ │   ├── index.ts
│ │   └── [rid].ts
│ │
│ ├── search/ # 검색 API
│ │ └── index.ts
│ ├── top-rated/
│ │ └── index.tsx
│ └── sentry-example-api.ts # Sentry 샘플 API
│
├── sentry-example-page.tsx # Sentry 샘플 페이지
├── _app.tsx
├── _document.tsx
└── _error.tsx

src/
├── components/ (presenters, hoc, utils)
├── containers/
├── repositories/
└── services/ (__tests__ 포함)
```

참고 : moviePage / TVbroadcast는 미디어 타입별 화면 분리를 위해 구성되었습니다.

<br/>
<br/>

### 핵심 기능

<!-- 사진첨부 -->

- 영화/TV 탐색 및 상세 조회
- 회원 예매(로그인)
  - 좌석 선택 후 예매
  - 마이페이지 예매 내역 조회
- 비회원 예매
  - 비회원 정보 생성/검증 router.push('/bookPage?bookingId=MongodbID')
  - `bookingId` 기반 예매 및 예매 내역 조회
- 즐겨찾기
  - 등록/해제/상태 조회
  - 영화/TV 타입별 목록 관리
- 마이페이지
  - 프로필 수정
  - 즐겨찾기 관리
  - 예매 내역 확인
  - 피드백 작성/조회/수정
- 관리자 피드백
  - 목록/상세 조회
  - 상태 관리
  - 답글 생성/수정/삭제(소프트 삭제)
- 통합 검색 및 상영 시간/좌석 조회

<br/>
<br/>

### 주요 API 엔드포인트 요약

- `POST /api/auth/signup` — 회원가입
- `GET /api/movies/fetchMovies` — 영화 목록
- `GET /api/movies/:id` — 영화 상세
- `GET /api/TV` — TV 목록
- `GET /api/TV/:id` — TV 상세
- `GET /api/search` — 통합 검색
- `GET /api/top-rated` — 홈 상단 추천/영상 데이터
- `GET /api/bookingFetchMovies` — 예매 진입용 영화 목록
- `POST /api/booking` — 회원/비회원 예매 생성(1좌석 정책)
- `GET /api/booking/:id` — 예매 영수증/상세
- `GET /api/booking/myPageList` — 회원 예매 목록
- `GET /api/showtimes` — 상영 시간 조회
- `GET /api/showtimes/exists` — 상영 가능 여부
- `GET /api/showtimes/:id/seat` — 좌석 조회
- `POST /api/non-member/create` — 비회원 생성/조회 후 ID 반환
- `POST /api/non-member/search` — 비회원 예매 내역 조회
- `POST /api/favorite/add` — 즐겨찾기 추가
- `DELETE /api/favorite/remove` — 즐겨찾기 제거
- `GET /api/favorite/status` — 즐겨찾기 상태/목록
- `PUT /api/profile/update` — 프로필 수정
- `GET/POST /api/profile/feedback` — 피드백 조회/생성
- `PATCH /api/profile/feedback/edit/:id` — 피드백 수정
- `GET /api/adminFeedback` — 관리자 피드백 목록
- `GET/PATCH /api/adminFeedback/:id` — 관리자 상세/상태 변경
- `GET /api/adminFeedback/stats` — 피드백 통계
- `GET /api/adminFeedback/status` — 상태별 집계
- `POST /api/adminFeedback/:id/response` — 관리자 답글 생성
- `PATCH/DELETE /api/adminFeedback/:id/response/:rid` — 관리자 답글 수정/삭제

<br/>
<br/>

### 유저 플로우 요약 (Mermaid)

```mermaid
graph TD
    Home["index.tsx: 메인 페이지"] --> MovieList["moviePage: 영화 목록"]
    Home --> TVList["TVbroadcast: TV 방송 목록"]
    Home --> Auth["authPage/signup.tsx: 인증"]
    Home --> NonMember["non-member/index.tsx: 비회원 조회"]

    MovieList --> MovieDetail["moviePage/[id].tsx: 영화 상세"]
    MovieDetail --> Booking["bookPage: 예매하기"]
    Booking --> BookingDetail["bookPage/[movieId].tsx: 좌석 선택 및 예매"]

    Home --> MyPage["mypage: 마이페이지 메인"]
    MyPage --> MyTickets["mypage/tickets.tsx: 예매 내역"]
    MyPage --> MyFavs["mypage/favoriteList.tsx: 즐겨찾기]
    MyPage --> ProfileEdit["mypage/edit.tsx: 회원정보 수정"]

    MyPage --> FeedbackList["mypage/feedback: 피드백 목록"]
    FeedbackList --> FeedbackWrite["mypage/feedback/write.tsx: 피드백 작성"]

    Home --> AdminFeedback["feedbackAdmin/index.tsx: 관리자 피드백"]
```

[개인 벨로그 링크](https://velog.io/@jh_000velog/%EC%98%81%ED%99%94-%EC%98%88%EB%A7%A4-%EC%82%AC%EC%9D%B4%ED%8A%B8-%EC%9C%A0%EC%A0%80%ED%94%8C%EB%A1%9C%EC%9A%B0)
<br/>
<br/>

### 인증 • 보안 설계

- NextAuth 기반 JWT 세션 전략
- 제공자: Credentials / Kakao / Naver
- 역할(Role): `user`, `admin`
- 소셜 계정 식별값은 `SOCIAL_PEPPER_HMAC_SECRET`로 해시하여 저장
- 관리자 부여는 `ADMIN_EMAILS` 기반 분기 + DB role 반영
- 미들웨어 보호:
  - `/mypage/*` 인증 필요 (`reason=auth`)
  - `/feedbackAdmin/*` 관리자 필요 (`reason=admin`)
- `/bookPage`는 비회원 예매 지원을 위해 미들웨어 강제 보호 대상에서 제외
- 비밀번호 저장 시 `bcryptjs` 해시 적용

<br/>
<br/>

### 실행 방법

1. 환경변수 설정
   `.env.example` 파일을 복사하여 `.env.local` 파일을 생성합니다.
   현재 코드 기준으로 아래 키를 함께 준비해야 합니다.
   - `MONGODB_URI`
   - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_IMAGE_BASE_URL`
   - `API_SECRET_KEY`
   - `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`
   - `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`
   - `ADMIN_EMAILS`
   - `SOCIAL_PEPPER_HMAC_SECRET`
   - `SENTRY_DSN`
2. 설치: `yarn install`
3. 개발 서버: `yarn dev`
4. 선택 실행
   - 타입체크: `yarn tsc --noEmit`
   - 테스트: `yarn test`
   - E2E: `yarn playwright test`
   - 영화/상영 시드: `yarn seed`
   - 피드백 마이그레이션: `yarn migrate`

<br/>
<br/>

### 향후 개선 사항

- 실제 PG사 결제 연동
- 예매 취소/환불 워크플로우 개선

<br/>
<br/>

### 라이선스

This project is licensed under the MIT License.
본 프로젝트는 TMDB API를 사용합니다.  
프로젝트의 코드를 참고하거나 일부를 사용하는 경우  
GitHub 저장소 링크 또는 작성자(groguJH/junghwa)를 출처로 남겨주시면 감사하겠습니다.
