"use client";

import Image from "next/image";
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
  index,
  onClickReserve,
  onClickDetail,
}: MovieItemProps) {
  return (
    <ContentItem>
      <Image
        src={
          movie?.backdropPath
            ? `${ImageBaseUrl}w780${movie.backdropPath}`
            : "/fallback.jpg"
        }
        width={780}
        height={movie.backdropPath ? 439 : 300}
        alt={movie.title}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        priority={index === 0}
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
