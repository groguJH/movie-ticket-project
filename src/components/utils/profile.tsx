import styled from "@emotion/styled";

export const SideMenuBanner = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 150px;
  background: linear-gradient(135deg, rgb(226, 147, 35), rgb(235, 132, 15));
  align-items: center;
  position: relative;
  border-top-right-radius: 8px;
  margin-bottom: 1rem;
  padding-left: 1rem;
`;
export const MyAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
  margin-right: 1rem;
`;

export const UserTitle = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;
export const UserIntro = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  margin-right: 5px;
  font-weight: bold;
`;

export const UserName = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

export const UserText = styled.span`
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

export const SideMenuSpacer = styled.div`
  height: 100px;
`;
