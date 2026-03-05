import {
  SearchInput,
  ResultList,
  ResultItem,
  Wrapper,
} from "../../utils/SearchLayout";
import { useRouter } from "next/router";

export interface SearchProp {
  query: string;
  handleResultClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  results: any[];
  loading: boolean;
  onSearch: () => void;
}

export default function SearchPresenter({
  query,
  handleResultClick: handleResultClick,
  results,
  loading,
  onSearch,
}: SearchProp) {
  const router = useRouter();
  return (
    <Wrapper>
      <SearchInput
        placeholder="영화, TV 프로그램을 검색해보세요"
        value={query}
        onChange={handleResultClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
      />

      {!loading && results.length > 0 && (
        <ResultList>
          {results.map((item) => (
            <ResultItem
              key={item.id}
              onClick={() => {
                const searchQuery =
                  item.media_type === "movie"
                    ? `/moviePage/${item.id}`
                    : `/TVbroadcast/${item.id}`;
                router.push(searchQuery);
              }}
            >
              {item.title || item.name}
            </ResultItem>
          ))}
        </ResultList>
      )}
    </Wrapper>
  );
}
