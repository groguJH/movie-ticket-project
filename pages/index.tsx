import { FloatButtonStyled } from "../src/components/utils/HomeCarouselLayout";
import React, { useEffect, useState } from "react";
import QuestionCircleOutlined from "@ant-design/icons/lib/icons/QuestionCircleOutlined";
import HelpInfoModal from "../src/components/utils/HelpInfoModal";
import CarouselContainer from "../src/containers/HomeCarousel/CarouselContainer";
import TopRatedContainer from "../src/containers/top-rated/TopRatedContainer";
import { useRouter } from "next/router";
import { message } from "antd";
import Seo from "../src/components/hoc/Seo";
import { findBookingMoviesService } from "../src/services/bookingTicket/bookingfindMoviesService";
import { Movie } from "../types/MovieCarouselData";

export default function HomePage({
  initialMovies,
}: {
  initialMovies: Movie[];
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const reason = router.query.reason;

    if (reason === "auth") {
      message.error("로그인이 필요한 서비스입니다");
    }

    if (reason === "admin") {
      message.error("접근 권한이 없습니다");
    }

    router.replace("/", undefined, { shallow: true });
  }, [router, router.isReady]);

  function handleClick(): void {
    setIsModalOpen(true);
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const description =
    "최신 영화 예매, 방영중인 TV프로그램 정보확인, 좋아요 기능이 있는 개인 프로젝트입니다.";
  const noindex = false;
  const seoImage = "/movie.png";
  const seoUrl = "/";

  return (
    <>
      <Seo
        title="홈"
        description={description}
        noindex={noindex}
        image={seoImage}
        url={seoUrl}
      />
      <main>
        <section>
          <CarouselContainer initialData={initialMovies} />
        </section>

        <section>
          <TopRatedContainer />
        </section>

        <section>
          <FloatButtonStyled
            onClick={handleClick}
            icon={<QuestionCircleOutlined />}
            description="HELP INFO"
            shape="square"
            tooltip={{
              title: "페이지 설명서",
              placement: "top",
              color: "#4445465f",
            }}
          />
          <HelpInfoModal isOpen={isModalOpen} onClose={handleModalClose} />
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const movies = await findBookingMoviesService();

    return {
      props: {
        initialMovies: movies || [],
      },
    };
  } catch (error) {
    console.error("SSR 영화 데이터 가져오기 실패:", error);
    return {
      props: {
        initialMovies: [],
      },
    };
  }
}
