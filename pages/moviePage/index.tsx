import Seo from "../../src/components/hoc/Seo";
import MovieListContainer from "../../src/containers/movieList/MovieList";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
export default function MovieListPage({
  initialMovies,
  firstMovie,
}: {
  initialMovies: any[];
  firstMovie: any;
}) {
  const seoUrl = "/moviePage";
  const description =
    firstMovie?.overview ||
    firstMovie?.description ||
    "최신 상영 영화 정보를 확인할 수 있습니다.";

  return (
    <>
      <Seo
        title="영화 목록"
        description={description}
        noindex={false}
        image={
          firstMovie?.backdrop_path
            ? `${IMAGE_BASE_URL}w700${firstMovie.backdrop_path}`
            : undefined
        }
        url={seoUrl}
      />
      <MovieListContainer />
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { req } = context;
  const proto =
    (req.headers["x-forwarded-proto"] as string) ||
    (req.connection && (req.connection as any).encrypted ? "https" : "http");
  const host = req.headers.host;
  const origin = `${proto}://${host}`;
  const res = await fetch(`${origin}/api/movies/fetchMovies?page=1`);
  const data = await res.json();
  return {
    props: {
      initialMovies: data.results,
      firstMovie: data.results?.[0] || null,
    },
  };
}
