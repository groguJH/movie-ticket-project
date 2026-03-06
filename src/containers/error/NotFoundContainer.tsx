import React from "react";
import NotFoundPresenter from "../../components/presenters/error/NotFoundPresenter";
import { useRouter } from "next/router";

export default function NotFoundContainer() {
  const router = useRouter();

  const handleClickHome = () => {
    router.push("/");
  };
  const handleClickBack = () => {
    router.back();
  };
  return (
    <NotFoundPresenter
      onClickHome={handleClickHome}
      onClickBack={handleClickBack}
    />
  );
}
