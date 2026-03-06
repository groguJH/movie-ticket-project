import styled from "@emotion/styled";
import { BiLockAlt } from "react-icons/bi";
import { Button } from "antd";
import { LogInIcon } from "../../utils/IconStyle";

const BannerBox = styled.div`
  background-color: #fff;
  border: none;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 1rem 0;
`;

const IconBox = styled.div`
  background-color: #fffbe6;
  padding: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 6px;
`;

const Message = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #595959;
`;

const ButtonInnerBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1px;
  font-size: 14px;
  color: #1677ff;
  &:hover {
    color: #69b1ff; /* 밝은 파랑으로 hover 효과 */
  }
`;

interface SideMenuBannerProps {
  onLoginClick: () => void;
}

export default function LoginRequiredBanner({
  onLoginClick,
}: SideMenuBannerProps) {
  return (
    <BannerBox>
      <IconBox>
        <BiLockAlt size={20} color="#faad14" />
      </IconBox>

      <TextBox>
        <Message>로그인이 필요한 기능입니다</Message>
        <ButtonInnerBox>
          <Button type="link" size="small" onClick={onLoginClick}>
            로그인하러 가기
            <LogInIcon />
          </Button>
        </ButtonInnerBox>
      </TextBox>
    </BannerBox>
  );
}
