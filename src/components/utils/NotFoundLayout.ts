import styled from "@emotion/styled";

export const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 80vh;
  padding: 4.5rem 1rem;
`;

export const NotFoundContent = styled.div`
  width: min(520px, 92%);
  padding: 1rem 1rem 3.4rem;
  text-align: center;
`;

export const NotFoundImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  margin-top: 1rem;
  margin: 0;
`;

export const NotFoundTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: orange;
  margin-bottom: 2rem;
`;

export const NotFoundText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2.5rem;
`;

export const NotFoundButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.8rem;
`;
