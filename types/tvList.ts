export interface TvDataRequest {
  id: number;
  name: string;
  original_title: string;
  backdrop_path: string;
  overview: string;
  popularity: number;
  TvImage: string;
  tvList: string;
}

export interface TvListPresenterProps {
  TvImage: TvDataRequest | null;
  page: number;
  total_pages: number;
  TvInfo: TvDataRequest[];
  isFetching: boolean;
  imageBaseUrl: string;
  results: TvDataRequest[];
}
