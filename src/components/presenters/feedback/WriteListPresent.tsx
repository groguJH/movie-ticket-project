import {
  Form,
  Textarea,
  Label,
  Title,
  Wrapper,
  Input,
  SatisfactionLabel,
} from "../../utils/WriteForm";
import OpenMessageButton from "./OpenMessageButton";
import { FcInspection } from "react-icons/fc";
import CustomRadio from "../../utils/CustomRadioGroup";

export interface WriteListPresentProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  onSubmit: () => void;

  userName: string;
  isPending: boolean;
  isError: boolean;
  satisfaction: string;
  setSatisfaction: (satisfaction: string) => void;
}

export default function WriteListPresent({
  title,
  setTitle,
  content,
  setContent,
  onSubmit,
  userName,
  isPending,
  isError,
  satisfaction,
  setSatisfaction,
}: WriteListPresentProps) {
  return (
    <Wrapper className="write-feedback-wrapper">
      <Form className="write-feedback-form">
        <Title>
          이 사이트에 대한 의견을 남겨주세요
          <FcInspection fontSize={32} />
        </Title>

        <Label>
          <span>작성자</span> : {userName} 님
        </Label>
        <Label>
          <span>제목</span>{" "}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></Input>
        </Label>
        <Label>
          <span>내용</span>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></Textarea>
        </Label>
        <Label>
          <span>해당 포트폴리오에 대한 솔직한 평가를 남겨주세요</span>
          <SatisfactionLabel>
            <CustomRadio
              value="매우만족"
              selected={satisfaction}
              onChange={setSatisfaction}
            />
            <CustomRadio
              value="만족"
              selected={satisfaction}
              onChange={setSatisfaction}
            />
            <CustomRadio
              value="보통"
              selected={satisfaction}
              onChange={setSatisfaction}
            />
            <CustomRadio
              value="불만족"
              selected={satisfaction}
              onChange={setSatisfaction}
            />
            <CustomRadio
              value="매우 불만족"
              selected={satisfaction}
              onChange={setSatisfaction}
            />
          </SatisfactionLabel>
        </Label>
        <OpenMessageButton onClick={onSubmit}>작성 완료</OpenMessageButton>
      </Form>
    </Wrapper>
  );
}
