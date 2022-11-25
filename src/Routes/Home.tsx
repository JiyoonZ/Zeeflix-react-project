import {useQuery} from "react-query";
import styled from "styled-components";
import {CategoryType, getMovies, IGetMoviesResult} from "../api";
import {makeImagePath} from "../utils";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{bgpath: string}>`
  height: 100vh;
  padding: 90px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  background-image: linear-gradient(rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 1)),
    url(${(props) => props.bgpath});
  background-size: cover;
`;
const Title = styled.h2`
  margin-bottom: 20px;

  font-size: 68px;
  font-weight: 500;
`;
const Overview = styled.p`
  width: 50%;
  font-size: 1.5rem;
  font-family: "Source Sans Pro";
  font-weight: 300;
`;

function Home() {
  // 현재 상영작 API
  const {data, isLoading} = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    () => getMovies(CategoryType.now_playing)
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgpath={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <>
            <Slider sortMenu={"movies"} category={CategoryType.now_playing} />
            <Slider sortMenu={"movies"} category={CategoryType.upcoming} />
            <Slider sortMenu={"movies"} category={CategoryType.popular} />
            <Slider sortMenu={"movies"} category={CategoryType.top_rated} />
          </>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
