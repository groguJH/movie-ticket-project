import {
  NoticeCard,
  NoticeList,
  NoticeSection,
  NoticeSubtitle,
  NoticeTitle,
} from "../../utils/Layout";

export default function RefundPresenter() {
  return (
    <>
      <NoticeSection>
        <NoticeTitle>예매확인</NoticeTitle>
        <NoticeCard>
          <NoticeSubtitle>⚠️ 주의사항</NoticeSubtitle>
          <NoticeList>
            <li>예매 후 좌석 변경은 불가하며, 취소 후 재예매해야 합니다</li>
            <li>영화 상영 중단 시 100% 환불 처리됩니다</li>
            <li>예매번호 분실 시 본인 확인 후 조회 가능합니다</li>
            <li>단체 예매(10매 이상)는 별도 문의 바랍니다</li>
          </NoticeList>
        </NoticeCard>
      </NoticeSection>
    </>
  );
}
