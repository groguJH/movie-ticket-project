import { Button } from "antd";
import styled from "@emotion/styled";
import { FaHeart } from "react-icons/fa";
import { ButtonProps } from "../../../../types/favoriteButton";

export default function ButtonFavoritePresenter({
  isFavorited,
  onClick,
}: ButtonProps) {
  return (
    <Button onClick={onClick}>
      {isFavorited ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      <FaHeart color={isFavorited ? "red" : "gray"} />
    </Button>
  );
}
