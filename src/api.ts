const API_KEY = "0954a99f1d375b34ed91cf73343298cc";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  name?: string;
}
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export enum CategoryType {
  "now_playing" = "now_playing",
  "popular" = "popular",
  "top_rated" = "top_rated",
  "upcoming" = "upcoming",
}
export async function getMovies(category: CategoryType) {
  return await fetch(
    `${BASE_PATH}/movie/${category}?api_key=${API_KEY}&page=1&region=kr`
  ).then((resp) => resp.json());
}
