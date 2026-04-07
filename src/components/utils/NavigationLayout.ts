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

  @media (max-width: 768px) {
    height: 64px;
    padding: 0 0.5rem;
  }
`;

export const NavList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
`;

export const NavGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const LeftGroup = styled(NavGroup)`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.35rem;
  }
`;

export const CenterGroup = styled(NavGroup)`
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
`;

export const RightGroup = styled(NavGroup)`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.35rem;
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

  @media (max-width: 768px) {
    padding: 0.35rem;
    margin-bottom: 0;

    span {
      font-size: 0.875rem;
    }

    .popcorn {
      width: 32px;
      height: 32px;
    }

    &.desktop-nav-item,
    &.auth-text-item {
      display: none;
    }

    &.user-nav-item span {
      display: none;
    }
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

  @media (max-width: 768px) {
    top: 64px;
    left: ${({ visible }) => (visible ? "0" : "-220px")};
    width: 220px;
    height: calc(100vh - 64px);
  }
`;

export const MainContent = styled.main`
  margin-top: 80px;
  min-height: calc(100vh - 80px);
  background-color: #f5f5f5;
  position: relative;
  width: 100%;

  @media (max-width: 768px) {
    margin-top: 64px;
    min-height: calc(100vh - 64px);
  }
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

  @media (max-width: 768px) {
    gap: 8px;

    svg {
      font-size: 18px;
    }

    span {
      font-size: 14px;
    }
  }
`;
