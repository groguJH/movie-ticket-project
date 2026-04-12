export interface NavigationPresenterProps {
  isSideMenuVisible: boolean;
  onToggleSideMenu: () => void;
  onSearchClick: () => void;
  onMovieClick: () => void;
  onHomeClick: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onBookingClick: () => void;
  onLogoutClick: () => void;
  onMyPageClick: () => void;
  onBookingHistoryClick: () => void;
  onEditProfile: () => void;
  onTVClick: () => void;
  onGuestClick: () => void;
  onFavoritesClick: () => void;
  status: "loading" | "authenticated" | "unauthenticated";
  userName: string | null;
  userRole: "user" | "admin" | null;
  userProfileImage: string | null;
  userId: string | null;
  children: React.ReactNode;
  isSearchVisible: boolean;
  onClickAdminFeedback: () => void;
}
