import {useQuery} from "@tanstack/react-query";
import styled from "styled-components";
import {getMovies, IGetMoviesResult} from "../api";
import {makeImagePath} from "../utils";
import {motion, AnimatePresence} from "framer-motion";
import {useState} from "react";
import {resourceLimits} from "worker_threads";

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{bgPath: string}>`
  height: 100vh;
  /* background-color: red; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.8) 80%, rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPath});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  width: 50%;
  font-size: 20px;
`;
const Slider = styled.div`
  position: relative;
  top: -140px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{bgPath: string}>`
  background-color: white;
  height: 200px;
  font-size: 40px;
  background-image: url(${(props) => props.bgPath});
  background-size: cover;
  background-position: center center;
`;

const rowVars = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};
const offset = 6; //한슬라이드에 보여줄 영와의 갯수
function Home() {
  const {data, isLoading} = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0); // 페이지 번호 , index
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      // 총 영화의 갯수 (배너에있느 영화는 제외)
      const totalMovies = data.results.length - 1;
      // 최대 페이지 , 19개라면 19개/6개씩 3.13 따라서 총 4페이지로 반올림후 index는 zerobase 이므로 -1
      const maxIndex = Math.floor(totalMovies / offset) - 1;

      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPath={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{type: "tween", duration: 1}}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      bgPath={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      {movie.title}
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
