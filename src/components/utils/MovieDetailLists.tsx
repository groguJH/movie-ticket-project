import styled from "@emotion/styled";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;

  @media (max-width: 768px) {
    min-height: auto;
    justify-content: flex-start;
    padding: 0 0 24px;
  }
`;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 1rem;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin: 1rem auto;
  flex-wrap: wrap;
`;

export const LikeButtonWrapper = styled.div`
  display: inline-flex;
  margin-left: auto;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    margin-left: 0;
    margin-bottom: 1rem;
  }
`;
