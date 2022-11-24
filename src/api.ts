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
  "upcoming" = "upcoming",
  "popular" = "popular",
  "top_rated" = "top_rated",
}
export async function getMovies(category: CategoryType) {
  return await fetch(
    `${BASE_PATH}/movie/${category}?api_key=${API_KEY}&page=1&region=kr`
  ).then((resp) => resp.json());
}

export async function getTvShow(tvCategory: CategoryType) {
  const categoryValue =
    tvCategory === "now_playing"
      ? "on_the_air"
      : tvCategory === "upcoming"
      ? "airing_today"
      : tvCategory;
  return await fetch(
    `${BASE_PATH}/tv/${categoryValue}?api_key=${API_KEY}&language=en-US&page=1`
  ).then((resp) => resp.json());
}
