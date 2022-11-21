const API_KEY = "0954a99f1d375b34ed91cf73343298cc";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (resp) => resp.json()
  );
}
