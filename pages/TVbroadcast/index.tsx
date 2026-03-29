import Seo from "../../src/components/hoc/Seo";
import TvListContainer from "../../src/containers/tvList/TvListContainer";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL as
  | string
  | undefined;
export default function index({
  initialMovies,
  firstTv,
}: {
  initialMovies: any[];
  firstTv: any;
}) {
  const seoUrl = "/TVbroadcast";
  const description =
    firstTv?.overview ||
    firstTv?.description ||
    "현재 방영 중인 TV 프로그램 정보를 확인할 수 있습니다.";

  return (
    <div>
      <Seo
        title="TV 방송 목록"
        description={description}
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
  try {
    const res = await fetch(`${origin}/api/TV?page=1`);

    if (!res.ok) {
      throw new Error("방영중인 TV 데이터를 가져오는 데 실패했습니다.");
    }

    const data = await res.json();

    return {
      props: {
        initialMovies: data.resultData || [],
        firstTv: data?.resultData?.[0] || null,
      },
    };
  } catch (error) {
    console.error("Tv 데이터 가져오기 실패", error);

    return {
      props: {
        initialMovies: [],
        firstTv: null,
      },
    };
  }
}
