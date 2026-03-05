import withAuth from "../../src/components/hoc/withAuth";
import MyPageFavListContainer from "../../src/containers/myPage/FavListContainer";

function FavoriteListPage() {
  return <MyPageFavListContainer />;
}

export default withAuth(FavoriteListPage);
