import dynamic from "next/dynamic";
import { Tabs } from "antd";
import { JSX } from "@emotion/react/jsx-runtime";
import { StyledTabs } from "../../src/components/presenters/booking/BookingFetchPresenter";

const { TabPane } = Tabs;

// 컨테이너는 SSR 비활성화(선택사항)
const FetchingMoviesContainer = dynamic(
  () => import("../../src/containers/booking/BookingFetchContainer"),
  { ssr: false }
);

export default function BookPage(): JSX.Element {
  return (
    <main>
      <header>
        <h1>현재 상영중인 영화</h1>
      </header>
      <StyledTabs defaultActiveKey="all" activeKey={undefined}>
        <TabPane tab="영화선택" key="movie" />
        <TabPane tab="상영관 선택" key="date" />
        <TabPane tab="좌석선택" key="seat" />
        <TabPane tab="예매내역 확인" key="confirm" />
      </StyledTabs>

      <FetchingMoviesContainer />
    </main>
  );
}
