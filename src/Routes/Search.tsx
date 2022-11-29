import {useEffect} from "react";
import {useQuery} from "react-query";
import {useLocation, useMatch} from "react-router-dom";
import styled from "styled-components";
import {
  getMoviesByKeyword,
  IGetSearchResults,
  getTvShowByKeyword,
} from "../api";
import {makeImagePath} from "../utils";
import {AnimatePresence} from "framer-motion";
import DetailMovie from "../Components/DetailMovie";
import SearchResults from "../Components/SearchResults";

const Wrapper = styled.div`
  padding: 50px;
  padding-top: 100px;
  height: 100vh;
`;
const SubTitle = styled.h1`
  font-size: 40px;
  margin: 20px 0;
`;

const EmptyResult = styled.div`
  font-size: 30px;
  font-weight: lighter;
  width: 100%;
  height: 50vh;
  text-align: center;
  padding: 25vh 0;
  color: rgba(255, 255, 255, 0.4);
`;

function Search() {
  const {search} = useLocation();
  const keyword = new URLSearchParams(search).get("keyword");

  // select => 아무런 poster 정보마저 없는 영화는 제외하기 위해서 사용
  const {
    data: movieData,
    isLoading: isMovieDataLoading,
    refetch,
  } = useQuery<IGetSearchResults>(
    ["search Moive", keyword],
    () => getMoviesByKeyword(String(keyword)),
    {
      select: (data) => {
        const newData = {
          ...data,
          results: data?.results.filter(
            (movie) =>
              movie.poster_path !== null && movie.backdrop_path !== null
          ),
        };
        return newData;
      },
    }
  );
  const {
    data: tvData,
    isLoading: isTvDataLoading,
    refetch: tvRefetch,
  } = useQuery<IGetSearchResults>(
    ["search TV", keyword],
    () => getTvShowByKeyword(String(keyword)),
    {
      select: (data) => {
        const newData = {
          ...data,
          results: data?.results.filter(
            (tv) => tv.poster_path !== null && tv.backdrop_path !== null
          ),
        };
        return newData;
      },
    }
  );

  useEffect(() => {
    refetch();
    tvRefetch();
  }, [keyword]);

  const bigMovieMatch = useMatch(`/search/:movieId`);
  const clickedMovie =
    (bigMovieMatch?.params.movieId &&
      movieData?.results.find(
        (movie) => movie.id + "" === bigMovieMatch.params.movieId
      )) ||
    tvData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch?.params.movieId
    );

  return (
    <Wrapper>
      <SubTitle>
        <span style={{fontSize: "30px"}}>Search results for</span> "
        {keyword?.toLocaleLowerCase()}".
      </SubTitle>
      {!isMovieDataLoading &&
      !isTvDataLoading &&
      movieData?.results.length &&
      tvData?.results.length ? (
        <>
          <SearchResults
            title="Tv show"
            datas={tvData}
            keyword={keyword + ""}
          />
          <SearchResults
            title="Movie"
            datas={movieData}
            keyword={keyword + ""}
          />
          <AnimatePresence>
            {clickedMovie && (
              <DetailMovie
                layoutId={clickedMovie.id + "_" + keyword}
                back={`/search?keyword=${keyword}`}
                clickedMovie={clickedMovie}
                scrollcenter={0}
                bgMoviePoster={makeImagePath(
                  clickedMovie.backdrop_path || clickedMovie.poster_path,
                  "w300"
                )}
                mainPoster={makeImagePath(clickedMovie.poster_path, "w300")}
              />
            )}
          </AnimatePresence>
        </>
      ) : (
        <EmptyResult>Sorry! No result found :(</EmptyResult>
      )}
    </Wrapper>
  );
}

export default Search;
