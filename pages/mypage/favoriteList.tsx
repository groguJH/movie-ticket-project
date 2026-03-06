import withAuth from "../../src/components/hoc/withAuth";
import MyPageFavListContainer from "../../src/containers/myPage/FavListContainer";

// 즐겨찾기 목록 페이지
// 인증된 사용자만 접근가능
function FavoriteListPage() {
  return <MyPageFavListContainer />;
}

export default withAuth(FavoriteListPage);
