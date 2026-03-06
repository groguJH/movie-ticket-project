import styled from "@emotion/styled";

export const NavContainer = styled.nav`
  width: 100%;
  display: flex;
  width: 100%;
  height: 80px;
  background-color: black;
  padding: 0 1rem;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
`;

export const NavList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const NavGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const LeftGroup = styled(NavGroup)`
  gap: 1rem;
  left: calc(16.666%); /* 기본: 1/6 */

  @media (max-width: 768px) {
    left: calc(20%);
  }

  @media (max-width: 480px) {
    left: calc(25%);
  }
`;

export const CenterGroup = styled(NavGroup)`
  justify-content: center;
`;

export const RightGroup = styled(NavGroup)`
  gap: 1rem;
  left: calc(83.333%); /* 기본: 5/6 */

  @media (max-width: 768px) {
    left: calc(80%);
  }

  @media (max-width: 480px) {
    left: calc(75%);
  }
`;

export const NavItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: white;
  padding: 0.5rem;
  margin-bottom: 5px;
  gap: 5px;
  transition: color 0.3s ease;

  span,
  svg {
    transition: color 0.3s ease;
  }

  &:hover span,
  &:hover svg {
    color: orange;
  }

  &:hover .popcorn {
    animation: pop 0.3s ease-in-out infinite alternate;
    filter: none;
  }

  .popcorn {
    width: 40px;
    height: 40px;
    animation: none;
  }

  @keyframes pop {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-8px) rotate(20deg);
    }
    100% {
      transform: translateY(0) rotate(0deg);
    }
  }
`;

export const SideMenuContainer = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 80px;
  left: ${({ visible }) => (visible ? "0" : "-250px")};
  width: 250px;
  height: calc(100vh - 80px);
  background-color: rgba(10, 10, 8);
  color: white;
  transition: left 0.3s ease;
  z-index: 1000;
  border-top-right-radius: 8px;
`;

export const MainContent = styled.main`
  margin-top: 80px;
  min-height: calc(100vh - 80px);
  background-color: #f5f5f5;
  position: absolute;
`;

export const WhiteSpan = styled.span`
  color: white;
`;

export const EditButton = styled.span`
  margin-left: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  svg {
    font-size: 18px;
  }
`;

export const MenuItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    font-size: 20px;
    vertical-align: middle;
  }

  span {
    font-size: 16px;
    line-height: 1;
  }
`;
