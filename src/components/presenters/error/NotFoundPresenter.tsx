import React, { JSX } from "react";
import {
  NotFoundButtonGroup,
  NotFoundContent,
  NotFoundImage,
  NotFoundText,
  NotFoundTitle,
  NotFoundWrapper,
} from "../../utils/NotFoundLayout";
import { Button } from "antd";

interface NotFoundPresenterProps {
  onClickHome: () => void;
  onClickBack: () => void;
}

export default function NotFoundPresenter({
  onClickHome,
  onClickBack,
}: NotFoundPresenterProps): JSX.Element {
  return (
    <NotFoundWrapper>
      <NotFoundContent>
        <NotFoundImage src={"/NotFound.png"}></NotFoundImage>
        <NotFoundTitle>페이지를 찾을 수 없습니다</NotFoundTitle>
        <NotFoundText>
          원하시는 결과를 찾을 수 없습니다
          <br />
          입력하신 주소가 정확한지 다시 한 번 확인해 주세요 <br />
          사이트 제작자에게 문의하시기 바랍니다.
        </NotFoundText>
        <NotFoundButtonGroup>
          <Button onClick={onClickHome}>홈으로 이동</Button>
          <Button onClick={onClickBack}>이전 페이지로 이동</Button>
        </NotFoundButtonGroup>
      </NotFoundContent>
    </NotFoundWrapper>
  );
}
