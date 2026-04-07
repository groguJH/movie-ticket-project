import React, { JSX } from "react";
import Image from "next/image";
import {
  MenuIcon,
  CloseIcon,
  PersonIcon,
  RatedMovies,
  BookingMovies,
  RatedTv,
  FavoriteLists,
  Signup,
  Editprofile,
  EditBoxLine,
  SearchIcon,
  SearchMinusIcon,
  GuestMovies,
} from "../../utils/IconStyle";
import { Avatar, Dropdown } from "antd";
import { NavigationPresenterProps } from "../../../../types/navigation";
import {
  CenterGroup,
  EditButton,
  LeftGroup,
  MainContent,
  MenuItemWrapper,
  NavContainer,
  NavItem,
  NavList,
  RightGroup,
  SideMenuContainer,
} from "../../utils/NavigationLayout";
import {
  MyAvatar,
  NameRow,
  SideMenuBanner,
  SideMenuSpacer,
  UserIntro,
  UserText,
  UserTitle,
} from "../../utils/profile";
import { SearchWrapper } from "../../utils/SearchLayout";
import SearchContainer from "../../../containers/navigation/SearchContainer";
import { ItemBlock } from "../../utils/loadingUI";

export default function NavigationPresenter({
  isSideMenuVisible,
  onToggleSideMenu,
  onSearchClick,
  onMovieClick,
  onHomeClick,
  onLoginClick,
  onLogoutClick,
  onSignupClick,
  onBookingClick,
  onMyPageClick,
  onBookingHistoryClick,
  onEditProfile,
  onTVClick,
  onFavoritesClick,
  onClickAdminFeedback,
  onGuestClick,
  status,
  userName,
  children,
  userId,
  isSearchVisible,
  userProfileImage,
}: NavigationPresenterProps): JSX.Element {
  const myName = "관리자";
  const isAdmin = userName === myName;

  const menuProps = {
    items: isAdmin
      ? [
          {
            key: "admin",
            label: "관리자 페이지",
            onClick: onClickAdminFeedback,
          },
          {
            key: "editProfile",
            label: "프로필 수정",
            onClick: onEditProfile,
          },
          {
            key: "logout",
            label: "로그아웃",
            onClick: onLogoutClick,
          },
        ]
      : [
          {
            key: "mypage",
            label: "마이 페이지",
            onClick: onMyPageClick,
          },
          {
            key: "editProfile",
            label: "프로필 수정",
            onClick: onEditProfile,
          },
          {
            key: "history",
            label: "예매 내역",
            onClick: onBookingHistoryClick,
          },
          {
            key: "logout",
            label: "로그아웃",
            onClick: onLogoutClick,
          },
        ],
  };

  return (
    <>
      <NavContainer>
        <NavList>
          <LeftGroup>
            <NavItem onClick={onToggleSideMenu} aria-label="사이드 메뉴 토글">
              {isSideMenuVisible ? <CloseIcon /> : <MenuIcon />}
            </NavItem>

            <NavItem onClick={onSearchClick} aria-label="검색 토글">
              {isSearchVisible ? <SearchMinusIcon /> : <SearchIcon />}
            </NavItem>
            <NavItem
              className="desktop-nav-item"
              onClick={onMovieClick}
              aria-label="영화 페이지로 이동하기"
            >
              <span>영화</span>
            </NavItem>
            <NavItem
              className="desktop-nav-item"
              onClick={onBookingClick}
              aria-label="예매 페이지로 이동버튼"
            >
              <span>예매</span>
            </NavItem>
            <NavItem
              className="desktop-nav-item"
              onClick={onTVClick}
              aria-label="방송 페이지로 이동하기"
            >
              <span>방송</span>
            </NavItem>
          </LeftGroup>
          <CenterGroup>
            <NavItem onClick={onHomeClick} aria-label="홈으로 이동하기">
              <Image
                className="popcorn"
                src="/movie.png"
                width={40}
                height={40}
                alt="홈"
                priority
              />
            </NavItem>
          </CenterGroup>
          <RightGroup>
            {status === "loading" ? (
              <>
                <NavItem>
                  <ItemBlock style={{ width: "40px" }} />
                </NavItem>
                <NavItem>
                  <ItemBlock style={{ width: "40px" }} />
                </NavItem>
              </>
            ) : status === "authenticated" && userName ? (
              <>
                <Dropdown
                  menu={menuProps}
                  trigger={["hover", "click"]}
                  placement="bottomRight"
                >
                  <NavItem className="user-nav-item">
                    <PersonIcon className="navIcons" />
                    <span>{userName}님</span>
                  </NavItem>
                </Dropdown>
                <NavItem className="auth-text-item" onClick={onLogoutClick}>
                  <span>로그아웃</span>
                </NavItem>
              </>
            ) : (
              <>
                {" "}
                <NavItem
                  onClick={onLoginClick}
                  aria-label="로그인 페이지로 이동하기"
                >
                  <PersonIcon />
                </NavItem>
                <NavItem
                  className="auth-text-item"
                  onClick={onSignupClick}
                  aria-label="회원가입 페이지로 이동하기"
                >
                  <span>회원가입</span>
                </NavItem>
              </>
            )}
          </RightGroup>
        </NavList>
      </NavContainer>

      {isSearchVisible && (
        <SearchWrapper>
          <SearchContainer onSearchClick={onSearchClick} />
        </SearchWrapper>
      )}

      <SideMenuContainer visible={isSideMenuVisible}>
        {userId ? (
          <SideMenuBanner>
            {userProfileImage ? (
              <MyAvatar src={`/${userProfileImage}.png`} alt="프로필 수정 전" />
            ) : (
              <Avatar
                size={56}
                style={{
                  marginRight: "1rem",
                }}
                icon={<PersonIcon />}
              />
            )}
            <UserIntro>
              <UserTitle>
                <NameRow>{userName}</NameRow>
                <UserText>님</UserText>
                <EditButton
                  onClick={onEditProfile}
                  aria-label="프로필 수정하기"
                >
                  <EditBoxLine />
                </EditButton>
              </UserTitle>
              {userProfileImage ? (
                <UserText>좋은 하루 되세요🍀</UserText>
              ) : (
                <UserText>프로필을 꾸며보세요</UserText>
              )}
            </UserIntro>
          </SideMenuBanner>
        ) : (
          <SideMenuSpacer />
        )}

        <NavItem onClick={onMovieClick}>
          <MenuItemWrapper>
            <RatedMovies />
            <span>최신 영화</span>
          </MenuItemWrapper>
        </NavItem>

        <NavItem onClick={onBookingClick}>
          <MenuItemWrapper>
            <BookingMovies />
            <span>티켓 예매</span>
          </MenuItemWrapper>
        </NavItem>

        <NavItem onClick={onGuestClick}>
          <MenuItemWrapper>
            <GuestMovies />
            <span>비회원 예매 확인</span>
          </MenuItemWrapper>
        </NavItem>

        <NavItem onClick={onTVClick}>
          <MenuItemWrapper>
            <RatedTv />
            <span>최신 방송</span>
          </MenuItemWrapper>
        </NavItem>

        <NavItem onClick={onFavoritesClick}>
          <MenuItemWrapper>
            <FavoriteLists />
            <span>즐겨찾기 목록</span>
          </MenuItemWrapper>
        </NavItem>

        <NavItem onClick={onSignupClick}>
          <MenuItemWrapper>
            <Signup />
            <span>회원 가입</span>
          </MenuItemWrapper>
        </NavItem>

        <NavItem onClick={onEditProfile}>
          <MenuItemWrapper>
            <Editprofile />
            <span>프로필 수정</span>
          </MenuItemWrapper>
        </NavItem>
      </SideMenuContainer>

      <MainContent>{children}</MainContent>
    </>
  );
}
