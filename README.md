# 🎬 TMDB API 기반 영화 예매 웹 서비스

<!-- 홈 화면 이미지 첨부 -->

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

신입 프론트엔드 포트폴리오용 프로젝트 입니다.
TMDB API로 영화/TV를 검색•탐색하고 회원·비회원 예매, 즐겨찾기, 마이페이지, 피드백을 구현한 애플리케이션입니다.
<br/>
단순히 TMDB API를 연동해 영화 목록을 보여주는 것이 아닌,
실제 영화 예매 서비스에 가까운 흐름을 구현하고 싶어 프로젝트를 준비하게 되었습니다.
<br/>
<br/>

### 기술 스택

<!-- 아이콘 첨부 -->

**Frontend**

- Next.js (pages router)<img src="https://img.shields.io/badge/v14-version?style=plastic&logo=nextdotjs&logoColor=ffffff&label=Nextjs&labelColor=black&color=black
  "/>
- TypeScript<img src="https://img.shields.io/badge/v5.8.3-blue?style=plastic&logo=TypeScript&logoColor=%233178C6&label=TypeScript&labelColor=blue&color=blue

  "/>

- React Query<img src="https://img.shields.io/badge/v5.71.5-red?style=plastic&logo=React%20Query&logoColor=%23FF4154&label=React%20Query&labelColor=red&color=red
  "/>
- Emotion (styled)<img src="https://img.shields.io/badge/v11.14.0-pink?style=plastic&logo=styled-components&logoColor=%23DB7093&label=styled-components&labelColor=pink&color=pink
  "/>

**Backend**

- Next.js API Routes<img src="https://img.shields.io/badge/v14-version?style=plastic&logo=nextdotjs&logoColor=ffffff&label=Nextjs&labelColor=black&color=black
  "/>
- MongoDB<img src="https://img.shields.io/badge/v6.15.0-green?style=plastic&logo=MongoDB&logoColor=%2347A248&label=MongoDB&labelColor=green&color=green
  "/>
- NextAuth (Credentials / Kakao / Naver)<img src="https://img.shields.io/badge/v4.24.11-blue?style=plastic&logo=next-auth&logoColor=blue&label=next-auth&labelColor=blue&color=blue
  "/>

**ETC**

- TMDB API<img src="https://img.shields.io/badge/TMDB-blue?style=plastic&logo=The%20Movie%20Database&logoColor=%2301B4E4&label=The%20Movie%20Database&labelColor=blue&color=blue
  "/>
- Yarn <img src="https://img.shields.io/badge/-blue?style=plastic&logo=Yarn&logoColor=%232C8EBB&label=Yarn&labelColor=blue&color=blue
  ">
- Vercel 배포
  <br/>
  <br/>

### 설계 구조

본 프로젝트는 유지보수와 확장성을 고려하여 레이으더 아키텍처와
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

- Container: 데이터 요청, 상태 관리(핸들러 등...) 를 담당합니다.
- Presenter: 오직 UI 렌더링만 담당합니다.

- Next.js API Routes: 서버리스 함수를 활용한 백엔드 API 엔드포인트 구축하였습니다.
- Service / Repository: 비즈니스 로직과 DB 로직 분리
- MongoDB: NoSQL 기반의 유연한 데이터 관리 활용

- Container/Presenter 패턴을 사용한 이유
  비즈니스 로직과 UI렌더링을 엄격히 분리하여 컴포넌트의 재사용성을 높이고
  무엇보다 테스트를 하기 위해 다음과 같은 패턴을 채택했습니다.
- React Query 를 사용한 이유
  프론트에서 React Query를 사용하여 서버 데이터 캐싱 및 동기화 로직을 선언적으로 관리하고, API 호출 횟수를 최적화 하여 렌더링을 위해 선택했습니다.

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
│ ├── index.tsx # 피드백 목록
│ └── write.tsx # 피드백 작성
│
├── authPage/ # 회원가입 페이지
│ └── signup.tsx
│
├── non-memberPage/ # 비회원 예매 조회
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
│ │ ├── index.ts # 예매 생성
│ │ ├── [id].ts # 예매 상세
│ │ └── myPageList.ts # 마이페이지 예매 목록
│ │
│ ├── bookingFetchMovies/ # 예매용 영화 데이터
│ │ └── index.ts
│ │
│ ├── showtimes/ # 상영 정보 / 좌석
│ │ ├── index.ts
│ │ ├── exists.ts
│ │ └── [id]/
│ │ └── seat.ts
│ │
│ ├── favorite/ # 즐겨찾기 API
│ │ ├── add.ts
│ │ ├── remove.ts
│ │ └── status.ts
│ │
│ ├── profile/ # 마이페이지 / 프로필
│ │ ├── update.ts
│ │ └── feedback/
│ │ ├── index.ts
│ │ └── edit/[id].ts
│ │
│ ├── adminFeedback/ # 관리자 피드백 API
│ │ ├── index.ts
│ │ ├── [id].ts
│ │ ├── stats.ts
│ │ ├── status.ts
│ │ └── [id]/response/
│ │ ├── index.ts
│ │ └── [rid].ts
│ │
│ └── search/ # 검색 API
│ └── index.ts
│
├── _app.tsx
├── _document.tsx
└── _error.tsx

```

참고 : moviePage / TVbroadcast: 미디어 타입별로 화면 분리하기 위해 만들었습니다

<br/>
<br/>

### 핵심 기능

<!-- 사진첨부 -->

영화/TV 탐색 및 상세조회
회원 예매(로그인) — 좌석선택, 결제 요약
비회원 예매 — 예약코드 발행, 예약 조회
즐겨찾기 — media_type 포함 저장
마이페이지 — 프로필(소셜/일반 구분) 수정, 즐겨찾기 관리, 예매내역 조회
피드백 — 사용자 제출 → 관리자 답변
전체 컨텐츠 검색
<br/>
<br/>

### 주요 API 엔드포인트 요약

- GET /api/movies/:id — 영화 상세
- GET /api/showtimes/:id — 상영정보
- POST /api/booking — 좌석 홀드/예매 요청
- POST /api/booking/confirm — 결제 확정
- POST /api/booking — 회원/비회원 예매
- POST /api/favorite/add — 즐겨찾기 등록
- POST /api/favorite/remove — 즐겨찾기 해제
- GET /api/profile/me — 로그인 유저 정보
- POST /api/profile/update — 프로필 수정
  <br/>
  <br/>

### 유저 플로우 요약 (Mermaid)

```mermaid
graph TD
    %% 메인 및 인증
    Home[index.tsx: 메인 페이지] --> MovieList[moviePage: 영화 목록]
    Home --> TVList[TVbroadcast: TV 방송 목록]
    Home --> Auth[authPage/signup.tsx: 회원가입]
    Home --> NonMember[non-memberPage: 비회원 조회]

    %% 영화 및 예매 로직
    MovieList --> MovieDetail[moviePage/[id].tsx: 영화 상세]
    MovieDetail --> Booking[bookPage: 예매하기]
    Booking --> BookingDetail[bookPage/[movieId].tsx: 좌석 선택 및 결제]

    %% 마이페이지 및 사용자 활동
    Home --> MyPage[mypage: 마이페이지 메인]
    MyPage --> MyTickets[mypage/tickets.tsx: 예매 내역]
    MyPage --> MyFavs[mypage/favoriteList.tsx: 찜 목록]
    MyPage --> ProfileEdit[mypage/edit.tsx: 회원정보 수정]

    %% 피드백 로직
    MyPage --> FeedbackList[mypage/feedback: 내 문의 내역]
    FeedbackList --> FeedbackWrite[mypage/feedback/write.tsx: 문의 작성]
```

[개인 벨로그 링크](https://velog.io/@jh_000velog/%EC%98%81%ED%99%94-%EC%98%88%EB%A7%A4-%EC%82%AC%EC%9D%B4%ED%8A%B8-%EC%9C%A0%EC%A0%80%ED%94%8C%EB%A1%9C%EC%9A%B0)
<br/>
<br/>

### 인증 • 보안 설계

NextAuth 기반 인증 JWT전략 커스터마이징 (Credentials + Kakao/Naver)
bcrypt로 비밀번호 해싱
세션 동기화(예: session-update 커스텀 이벤트)
<br/>
<br/>

### 실행 방법

1. 환경변수 설정
   .env.example 파일을 복사하여 .env.local 파일을 생성합니다.
2. 설치: yarn install
3. 개발 서버: yarn dev

<br/>
<br/>

### 향후 개선 사항

실제 PG사 연동하기
예매 취소/환불 워크플로우
<br/>
<br/>

### 라이선스

This project is licensed under the MIT License.
본 프로젝트는 TMDB API를 사용합니다.  
프로젝트의 코드를 참고하거나 일부를 사용하는 경우  
GitHub 저장소 링크 또는 작성자(groguJH/junghwa)를 출처로 남겨주시면 감사하겠습니다.
