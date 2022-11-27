import {useEffect} from "react";
import {useQuery} from "react-query";
import {useLocation} from "react-router-dom";
import styled from "styled-components";
import {getMoviesByKeyword, IGetSearchResults} from "../api";
import {makeImagePath} from "../utils";

const Wrapper = styled.div`
  padding: 50px;
  padding-top: 100px;
  height: 100vh;
`;
const SubTitle = styled.h1`
  font-size: 40px;
`;
const ResultsBox = styled.div`
  margin-top: 30px;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border: 1px solid white;
  gap: 10px;
`;
const Box = styled.div<{bgpath: string}>`
  width: 100%;
  height: 200px;
  border: 1px solid white;
  background-image: url(${(props) => props.bgpath});
  background-repeat: no-repeat;
  background-size: cover;
`;

function Search() {
  const {search} = useLocation();
  const keyword = new URLSearchParams(search).get("keyword");
  // select => 아무런 poster 정보마저 없는 영화는 제외하기 위해서 사용
  const {
    data: movieData,
    isLoading: isMovieData,
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
  console.log(movieData);
  useEffect(() => {
    refetch();
  }, [keyword]);
  return (
    <Wrapper>
      <SubTitle>
        "{keyword?.toLocaleLowerCase()}"에 대한 검색결과입니다.
      </SubTitle>
      <ResultsBox>
        {movieData?.results.map((movie) => (
          <Box bgpath={makeImagePath(movie.backdrop_path, "w300")}>
            <h1>{movie?.title}</h1>
          </Box>
        ))}
      </ResultsBox>
    </Wrapper>
  );
}

export default Search;
