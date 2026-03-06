import { CastProps } from "../../../../types/fetchMovieBooking";
import { CastCard, CastGrid, CastImage } from "../../utils/MovieCastListLayout";

export default function MovieCastList({ casts, imageBaseUrl }: CastProps) {
  return (
    <CastGrid>
      {casts?.map((cast) => (
        <CastCard key={cast.id}>
          <CastImage
            src={
              cast.profile_path
                ? `${imageBaseUrl}w500/${cast.profile_path}`
                : "../noActor.jpeg"
            }
          />

          <h4>{cast.name}</h4>
          <p>{cast.character}</p>
        </CastCard>
      ))}
    </CastGrid>
  );
}
