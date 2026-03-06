import Seo from "../../src/components/hoc/Seo";
import TvListContainer from "../../src/containers/tvList/TvListContainer";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL as
  | string
  | undefined;
const seoUrl = "https:/localhost:3000/";
export default function index({
  initialMovies,
  firstTv,
}: {
  initialMovies: any[];
  firstTv: any;
}) {
  return (
    <div>
      <Seo
        description={firstTv.description}
        noindex={false}
        image={
          firstTv?.backdrop_path
            ? `${IMAGE_BASE_URL}w700${firstTv.backdrop_path}`
            : "/movie.png"
        }
        url={seoUrl}
      />
      <TvListContainer />
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { req } = context;
  const proto =
    (req.headers["x-forwarded-proto"] as string) ||
    (req.connection && (req.connection as any).encrypted ? "https" : "http");
  const host = req.headers.host;
  const origin = `${proto}://${host}`;
  const res = await fetch(`${origin}/api/TV?page=1`);
  const data = await res.json();
  return {
    props: {
      initialMovies: data.resultData,
      firstTv: data.resultData?.[0] || null,
    },
  };
}
