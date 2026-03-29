import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 40px auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    margin: 24px auto;
    padding: 0 12px;
  }
`;

export const GreetingSection = styled.div`
  background: #1a1a2e;
  color: #fff;
  border-radius: 8px;
  padding: 24px;
  text-align: left;

  @media (max-width: 768px) {
    padding: 18px;
  }
`;

export const Greeting = styled.h2`
  margin: 0 0 8px;
  font-size: 24px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const LinkRow = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  a {
    color: #66b2ff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
  margin-top: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  color: #333;

  @media (max-width: 768px) {
    padding: 0.875rem;
  }
`;

export const CardTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 18px;
  color: #333;
`;
