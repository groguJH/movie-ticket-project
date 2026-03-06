"use client";

import { MovieItemProps } from "../../../../types/MovieCarouselData";
import {
  ContentItem,
  HoverItem,
  OverlayButton,
  TitleOverlay,
} from "../../utils/HomeCarouselLayout";

const ImageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

export default function MovieItemPresenter({
  movie,
  onClickReserve,
  onClickDetail,
}: MovieItemProps) {
  return (
    <ContentItem>
      <img
        src={
          movie?.backdropPath
            ? `${ImageBaseUrl}w780${movie.backdropPath}`
            : "/fallback.jpg"
        }
        alt={movie.title}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <TitleOverlay>{movie.title}</TitleOverlay>
      <HoverItem className="HoverItem">
        <OverlayButton onClick={() => onClickReserve(movie._id)}>
          예매하기
        </OverlayButton>
        <OverlayButton onClick={() => onClickDetail(movie._id)}>
          상세보기
        </OverlayButton>
      </HoverItem>
    </ContentItem>
  );
}
