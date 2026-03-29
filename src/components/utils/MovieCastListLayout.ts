import styled from "@emotion/styled";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

export const CastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
    padding: 0.5rem 0;
  }
`;

export const CastCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  h4 {
    margin: 0.75rem 0 0.35rem;
    font-size: 0.95rem;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
  }
`;

export const CastImage = styled.img`
  width: 100px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 84px;
    height: 126px;
  }
`;
