import Link from "next/link";
import { MyPagePresenterProps } from "../../../../types/myPage";
import {
  Card,
  Cards,
  CardTitle,
  Container,
  Greeting,
  GreetingSection,
  LinkRow,
} from "../../utils/MyPageLayout";

export default function MyPageLayout({ name, children }: MyPagePresenterProps) {
  return (
    <Container>
      <GreetingSection>
        <Greeting>안녕하세요 {name} 님</Greeting>
        <LinkRow>
          <Link href="/mypage/edit">개인정보 수정</Link>
          <Link href="/mypage/feedback/write">소중한 의견 보내기</Link>
        </LinkRow>
      </GreetingSection>

      <Cards>
        <Card>
          <CardTitle>나의 즐겨찾기</CardTitle>
          {children.favorites}
        </Card>
        <Card>
          <CardTitle>예매·구매 내역</CardTitle>
          {children.bookings}
        </Card>
      </Cards>
    </Container>
  );
}
