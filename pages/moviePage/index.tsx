import Seo from "../../src/components/hoc/Seo";
import MovieListContainer from "../../src/containers/movieList/MovieList";

const seoUrl = "https:/localhost:3000/";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
export default function MovieListPage({
  initialMovies,
  firstMovie,
}: {
  initialMovies: any[];
  firstMovie: any;
}) {
  return (
    <>
      <Seo
        description={firstMovie.description}
        noindex={false}
        image={
          firstMovie?.backdrop_path
            ? `${IMAGE_BASE_URL}w700${firstMovie.backdrop_path}`
            : "/movie.png"
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
