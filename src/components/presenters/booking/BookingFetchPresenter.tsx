import { Card, Button, Tabs } from "antd";
import styled from "@emotion/styled";
import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";
import { MoviePresenterProps } from "../../../../types/fetchMovieBooking";
import Image from "next/image";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL!;

const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    padding: 12px 0;
  }
`;
export const StyledTabs = styled(Tabs)`
  .ant-tabs-nav-list {
    pointer-events: none !important;
  }
  .ant-tabs-nav .ant-tabs-tab-btn {
    color: #eee;
  }
  .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #1890ff;
  }
  .ant-tabs-nav .ant-tabs-tab:hover .ant-tabs-tab-btn {
    color: #eee !important;
  }

  @media (max-width: 768px) {
    .ant-tabs-tab {
      padding: 8px 0 !important;
    }

    .ant-tabs-tab-btn {
      font-size: 13px;
    }
  }
`;

export function formatDate(date: string) {
  const day = new Date(date);
  return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(day.getDate()).padStart(2, "0")}`;
}

function FavoriteControl({
  movieId,
  mediaType,
}: {
  movieId: string;
  mediaType: "movie" | "tv";
}) {
  const userFrom = "로그인된_유저_ID";
  const [favorited, setFavorited] = useState(false);
  const [favoriteNumber, setFavoriteNumber] = useState(0);

  useEffect(() => {
    fetch(`/api/favorite/status?movieId=${movieId}&userFrom=${userFrom}`)
      .then((res) => res.json())
      .then((data) => {
        setFavorited(data.favorited);
        setFavoriteNumber(data.favoriteNumber);
      });
  }, [movieId, userFrom]);

  const handleFavoriteClick = async () => {
    const url = favorited ? "/api/favorite/remove" : "/api/favorite/add";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userFrom, movieId, mediaType: mediaType }),
    });
    const data = await res.json();
    setFavorited(!favorited);
    setFavoriteNumber(data.favoriteNumber);
  };
}

export default function FetchingMoviesPresenter({
  movies,
  onBookClick,
}: MoviePresenterProps) {
  const router = useRouter();
  return (
    <ListWrapper>
      {movies.map((movie) => (
        <Card
          key={movie._id}
          hoverable
          style={{ width: "100%" }}
          cover={
            <Image
              style={{ height: 160, objectFit: "cover" }}
              src={`${IMAGE_BASE_URL}w400${movie.backdropPath}`}
              alt={movie.title}
            />
          }
          actions={[
            <Button
              style={{ width: "100%", fontSize: 12 }}
              key="book"
              type="primary"
              onClick={() => onBookClick(movie._id, "", [])}
            >
              예매하기
            </Button>,
          ]}
        >
          <Card.Meta
            title={movie.title}
            description={`개봉일: ${formatDate(movie.releaseDate)}`}
          />
        </Card>
      ))}
    </ListWrapper>
  );
}
