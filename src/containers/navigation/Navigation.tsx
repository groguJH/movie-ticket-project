import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import NavigationPresenter from "../../components/presenters/navigation/Navigation";
import LoginModalContainer from "../login/LoginModalContainer";
import LoginRequiredModal from "../../components/presenters/login/LoginRequiredModal";
import SearchContainer from "./SearchContainer";

/**
 * 네비게이션 컨테이너 컴포넌트
 * @description
 * 1. NextAuth의 세션 상태를 관리하여 로그인/로그아웃 기능 제공
 * 2. 네비게이션 바의 사이드 메뉴, 로그인 모달, 검색창 등의 상태 관리
 * 3. 라우팅 이벤트를 감지하여 검색창 자동 닫기 기능 구현
 * 4. 사용자 프로필 편집 시 로그인 필요 안내 모달 처리
 * 5. 세션 업데이트 이벤트를 수신하여 세션 정보를 동기화
 */
const SESSION_UPDATE_EVENT = "session-update";

const NavigationContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRequireModalOpen, setIsRequireModalOpen] = useState(false);
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session, status, update } = useSession();

  useEffect(() => {
    const handleRouteChange = () => {
      setIsSearchOpen(false);
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const handleSessionUpdate = async (event: CustomEvent) => {
      try {
        await update({
          name: event.detail.name,
        });
      } catch (error) {
        console.error("Session update failed:", error);
      }
    };

    window.addEventListener(
      SESSION_UPDATE_EVENT,
      handleSessionUpdate as unknown as EventListener,
    );

    return () => {
      window.removeEventListener(
        SESSION_UPDATE_EVENT,
        handleSessionUpdate as unknown as EventListener,
      );
    };
  }, [update]);

  const onToggleSideMenu = () => {
    setIsSideMenuVisible((prev) => !prev);
  };

  const onLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const onEditProfile = () => {
    if (session?.user?.id) {
      router.push("/mypage/edit");
    } else {
      setIsSideMenuVisible(true);
      setIsRequireModalOpen(true);
    }
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);
  const closeRequireModal = () => setIsRequireModalOpen(false);

  const onLoginFromRequiredModal = () => {
    setIsRequireModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const onSearchClick = () => {
    setIsSearchOpen((prev) => !prev);
    ("검색버튼 클릭했다!");
  };

  return (
    <>
      <NavigationPresenter
        isSideMenuVisible={isSideMenuVisible}
        onToggleSideMenu={onToggleSideMenu}
        onLoginClick={onLoginClick}
        onLogoutClick={() => signOut({ callbackUrl: "/" })}
        onSignupClick={() => router.push("/authPage/signup")}
        onMovieClick={() => router.push("/moviePage")}
        onBookingClick={() => router.push("/bookPage")}
        onHomeClick={() => router.push("/")}
        onMyPageClick={() => router.push("/mypage")}
        onTVClick={() => router.push("/TVbroadcast")}
        onEditProfile={onEditProfile}
        onBookingHistoryClick={() => router.push("/mypage/tickets")}
        userName={session?.user?.name ?? null}
        userProfileImage={session?.user?.image ?? null}
        status={status}
        userId={session?.user?.id ?? null}
        onSearchClick={onSearchClick}
        onFavoritesClick={() => router.push("/mypage/favoriteList")}
        isSearchVisible={isSearchOpen}
        onClickAdminFeedback={() => router.push("/feedbackAdmin")}
        onGuestClick={() => {
          router.push("/non-member");
        }}
      >
        {children}

        {isSearchOpen && <SearchContainer onSearchClick={onSearchClick} />}
      </NavigationPresenter>

      {isLoginModalOpen && (
        <LoginModalContainer
          onClose={closeLoginModal}
          onNonMemberBooking={() => router.push("/non-member")}
        />
      )}

      <LoginRequiredModal
        visible={isRequireModalOpen}
        onClose={closeRequireModal}
        onLoginClick={onLoginFromRequiredModal}
      />
    </>
  );
};

export default NavigationContainer;
