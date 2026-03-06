import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 40px auto;
  padding: 0 20px;
`;

export const GreetingSection = styled.div`
  background: #1a1a2e;
  color: #fff;
  border-radius: 8px;
  padding: 24px;
  text-align: left;
`;

export const Greeting = styled.h2`
  margin: 0 0 8px;
  font-size: 24px;
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
`;

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
  margin-top: 10px;
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  color: #333;
`;

export const CardTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 18px;
  color: #333;
`;
