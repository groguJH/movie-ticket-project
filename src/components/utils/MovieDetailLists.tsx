import styled from "@emotion/styled";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 수평 가운데 정렬 */
  justify-content: center; /* 수직 가운데 정렬 */
  min-height: 100vh; /* 화면 전체 높이를 사용 */
`;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  max-width: 1200px;
  margin-bottom: 1rem;
  padding: 1rem;
`;

// 버튼들을 감싸는 컨테이너: 버튼 사이에 gap을 주어 간격을 확보
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px; /* 버튼 사이에 16px 간격 */
  margin: 1rem auto;
`;

// 좋아요 버튼만 감싸는 래퍼: 인라인으로만 차지하며 오른쪽 정렬
export const LikeButtonWrapper = styled.div`
  display: inline-flex;
  margin-left: auto;
  margin-bottom: 1.5rem;
`;
