import { TopRatedMovies } from "../../../containers/top-rated/TopRatedContainer";
import YouTube from "react-youtube";
import {
  Wrapper,
  Title,
  Top5Wrapper,
  MovieList,
  MovieCard,
  Overview,
  VideoWrapper,
} from "../../utils/TopRatedList";

interface TopRatedProps {
  movies: TopRatedMovies[];
  selectedList: number | null;
  SetSelectedList: (id: number | null) => void;
}

export default function TopRatedPresenter({
  movies,
  selectedList,
  SetSelectedList,
}: TopRatedProps) {
  const selectedMovie = movies.find((m) => m.id === selectedList);

  return (
    <Wrapper>
      <Title>꼭 한번쯤 관람해야할 영화 TOP 5</Title>

      <Top5Wrapper>
        <MovieList>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              onClick={() =>
                selectedList === movie.id
                  ? SetSelectedList(null)
                  : SetSelectedList(movie.id)
              }
              isSelected={selectedList === movie.id}
            >
              <h3>{movie.title}</h3>
            </MovieCard>
          ))}
        </MovieList>

        {selectedMovie?.key && (
          <VideoWrapper>
            <h4>{selectedMovie.title}</h4>
            <Overview>{selectedMovie.overview}</Overview>
            <YouTube
              videoId={selectedMovie.key}
              opts={{ width: "100%", height: "300" }}
            />
          </VideoWrapper>
        )}
      </Top5Wrapper>
    </Wrapper>
  );
}
