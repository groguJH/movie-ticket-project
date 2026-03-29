import React from "react";
import styled from "@emotion/styled";
import GuestBookingContainer from "../../src/containers/non-member/GuestBookingContainer";

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 24px auto;
  padding: 0 16px 24px;
`;

export default function NonMemberPage() {
  return (
    <Container>
      <GuestBookingContainer />
    </Container>
  );
}
