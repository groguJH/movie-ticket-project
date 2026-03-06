import React from "react";
import styled from "@emotion/styled";
import GuestBookingContainer from "../../src/containers/non-member/GuestBookingContainer";

const Container = styled.div`
  max-width: 400px;
  margin: 40px auto;
  padding: 0 20px;
`;

export default function NonMemberPage() {
  return (
    <Container>
      <GuestBookingContainer />
    </Container>
  );
}
