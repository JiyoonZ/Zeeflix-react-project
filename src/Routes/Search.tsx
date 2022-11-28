import {useEffect} from "react";
import {useQuery} from "react-query";
import {useLocation, useMatch, useNavigate} from "react-router-dom";
import styled from "styled-components";
import {getMoviesByKeyword, IGetSearchResults} from "../api";
import {makeImagePath} from "../utils";
import {motion, AnimatePresence} from "framer-motion";
import DetailMovie from "../Components/DetailMovie";

const Wrapper = styled.div`
  padding: 50px;
  padding-top: 100px;
  height: 100vh;
`;
const SubTitle = styled.h1`
  font-size: 40px;
  margin: 20px 0;
`;
const ResultsBox = styled.div`
  /* height: 100%; */
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  /* border: 1px solid white; */
  gap: 10px;
  row-gap: 25px;
`;
const Box = styled(motion.div)<{bgpath: string}>`
  width: 100%;
  height: 200px;
  /* border: 1px solid white; */
  background-image: url(${(props) => props.bgpath});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  position: relative;
  cursor: pointer;
`;
const MenuTitle = styled.h1`
  font-size: 24px;
  font-weight: 300;
  padding: 15px 0;
`;
const Info = styled(motion.div)`
  width: 100%;

  position: absolute;
  bottom: 0;
  padding: 8px;

  opacity: 0;
  background: rgba(0, 0, 0, 0.6);
  text-align: center;
`;
const BoxVars = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    zIndex: 99,
    y: 5,
    borderRadius: 0,
    transition: {
      duration: 0.2,
      type: "tween",
    },
  },
};
const infoVars = {
  hover: {
    opacity: 1,
  },
  transition: {
    duration: 0.2,
    type: "tween",
  },
};

function Search() {
  const {search} = useLocation();
  const keyword = new URLSearchParams(search).get("keyword");
  const navigate = useNavigate();

  // select => 아무런 poster 정보마저 없는 영화는 제외하기 위해서 사용
  const {
    data: movieData,
    isLoading: isMovieDataLoading,
    refetch,
  } = useQuery<IGetSearchResults>(
    ["search Moive"],
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
  useEffect(() => {
    refetch();
  }, [keyword, search]);
  const onBoxClicked = (movieId: string) => {
    navigate(`/search/${movieId}?keyword=${keyword}`);
  };
  const bigMovieMatch = useMatch(`/search/:movieId`);
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    movieData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );

  return (
    <Wrapper>
      <SubTitle>
        <span style={{fontSize: "30px"}}>Search results for</span> "
        {keyword?.toLocaleLowerCase()}".
      </SubTitle>
      {!isMovieDataLoading && (
        <>
          <MenuTitle>Movie Results</MenuTitle>
          <ResultsBox>
            {movieData?.results.map((movie) => (
              <Box
                onClick={() => onBoxClicked(movie.id + "")}
                bgpath={makeImagePath(movie.backdrop_path, "w300")}
                variants={BoxVars}
                whileHover="hover"
                initial="normal"
                transition={{type: "tween"}}
                key={movie.id}
                layoutId={movie.id + "_" + keyword}
              >
                <Info variants={infoVars}>
                  <h1>{movie?.title}</h1>
                </Info>
              </Box>
            ))}
          </ResultsBox>
          <AnimatePresence>
            {clickedMovie && (
              <DetailMovie
                layoutId={clickedMovie.id + "_" + keyword}
                back={`/search?keyword=${keyword}`}
                clickedMovie={clickedMovie}
                scrollcenter={0}
                bgMoviePoster={makeImagePath(
                  clickedMovie.backdrop_path || clickedMovie.poster_path,
                  "w500"
                )}
                mainPoster={makeImagePath(clickedMovie.poster_path, "w200")}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
