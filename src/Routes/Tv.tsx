import {useQuery} from "react-query";
import styled from "styled-components";
import {CategoryType, getTvShow, IGetMoviesResult} from "../api";
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

function Tv() {
  // 현재 상영작 API
  const {data, isLoading} = useQuery<IGetMoviesResult>(["tv", "popular"], () =>
    getTvShow(CategoryType.popular)
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgpath={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <>
            <Slider sortMenu={"tv"} category={CategoryType.now_playing} />
            <Slider sortMenu={"tv"} category={CategoryType.popular} />
            <Slider sortMenu={"tv"} category={CategoryType.top_rated} />
            <Slider sortMenu={"tv"} category={CategoryType.upcoming} />
          </>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
