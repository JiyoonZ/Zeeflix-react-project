import styled from "styled-components";
import {makeImagePath} from "../utils";
// import {getMovies, getTvs, IGetMoviesResult} from "../api";
import {useQuery} from "react-query";
import {useState} from "react";
import {useNavigate, useMatch, PathMatch} from "react-router-dom";
import {useScroll, motion, AnimatePresence} from "framer-motion";
import {CategoryType, getMovies, getTvShow, IGetMoviesResult} from "../api";
import DetailMovie from "./DetailMovie";

const SliderContain = styled.div`
  position: relative;
  top: -12rem;
  height: 250px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(5, 1fr);
  position: absolute;
  width: 100%;
  padding: 0 30px;
`;

const Box = styled(motion.div)<{bgphoto: string}>`
  height: 160px;

  font-size: 60px;
  position: relative;

  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  border-radius: 12px;

  cursor: pointer;
  overflow: hidden;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  width: 100%;
  padding: 8px;

  position: absolute;
  bottom: 0;

  opacity: 0;
  background: rgba(0, 0, 0, 0.6);

  h4 {
    text-align: center;
    font-size: 16px;
  }
`;

const Button = styled.div<{isRight: boolean}>`
  width: 40px;
  height: 40px;

  position: absolute;
  top: 100px;
  right: ${(props) => (props.isRight ? 0 : null)};
  left: ${(props) => (props.isRight ? null : 0)};
  display: flex;
  place-items: center;

  border-radius: 12px;
  background-color: rgba(100, 100, 100, 0.4);
  cursor: pointer;
  svg {
    fill: white;
    width: 50px;
    height: 50px;
  }
`;
const CategoryTitle = styled(motion.div)`
  font-size: 18px;
  font-weight: 500;
  padding: 0 0 15px 30px;
`;
const rowVariants = {
  hidden: (reverse: number) => ({
    x: reverse < 0 ? -window.innerWidth : window.innerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: (reverse: number) => ({
    x: reverse < 0 ? window.innerWidth : -window.innerWidth,
  }),
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    zIndex: 99,
    y: 10,
    borderRadius: 0,
    transition: {
      delay: 0.2,
      duration: 0.2,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
  },
  transition: {
    delay: 0.5,
    duration: 0.1,
    type: "tween",
  },
};

const offset = 5;

interface ISliderProps {
  category: CategoryType;
  sortMenu: string;
}
function Slider({category, sortMenu}: ISliderProps) {
  // react-query 문 작성
  // 매개변수의 카테고리에 따라 호출하는 api 가 달라짐
  const {data, isLoading} = useQuery<IGetMoviesResult>(
    [sortMenu, category],
    () => {
      return sortMenu === "movies" ? getMovies(category) : getTvShow(category);
    }
  );
  const navigate = useNavigate();
  const {scrollY} = useScroll();
  const [index, setIndex] = useState(0); // 페이지 번호 , index
  const [leaving, setLeaving] = useState(false); // 슬라이드가 완전히 떠났는지 확인
  const [reverse, setReverse] = useState(0); // 페이지 방향

  // hover 할때마다 리렌더링 되는 불필요한 일같음.. 고민이 필요
  // const [showArrow, setShowArrow] = useState(false); // hover 했을때만 슬라이드 버튼 보이기

  // 클릭한 박스의 url에 id 값으로 데이터 필터링하기
  const bigMovieMatch = useMatch(`/${sortMenu}/${category}/:movieId`);
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  const onBoxClicked = (movieId: number) => {
    navigate(`/${sortMenu}/${category}/${movieId}`);
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const prevIndex = () => {
    if (data) {
      if (leaving) return;
      setReverse(-1);
      toggleLeaving();
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const nextIndex = () => {
    if (data) {
      if (leaving) return;
      setReverse(1);
      toggleLeaving();
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <SliderContain>
            <CategoryTitle>
              {category.toUpperCase().replace("_", " ")}
            </CategoryTitle>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={reverse}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{type: "tween", duration: 1}}
                key={index}
                custom={reverse}
              >
                {data?.results
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "_" + category}
                      key={movie.id + "_" + category}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{type: "tween"}}
                      bgphoto={makeImagePath(
                        movie.backdrop_path || movie.poster_path,
                        "w500"
                      )}
                      onClick={() => {
                        onBoxClicked(movie.id);
                      }}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <Button isRight={false} onClick={prevIndex}>
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z" />
                </svg>
              </Button>
              <Button isRight={true} onClick={nextIndex}>
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M18.629 15.997l-7.083-7.081L13.462 7l8.997 8.997L13.457 25l-1.916-1.916z" />
                </svg>
              </Button>
            </AnimatePresence>
          </SliderContain>
          <AnimatePresence>
            {clickedMovie && (
              <DetailMovie
                layoutId={bigMovieMatch.params.movieId + "_" + category}
                clickedMovie={clickedMovie}
                scrollCenter={scrollY.get()}
                bgMoviePoster={makeImagePath(
                  clickedMovie.backdrop_path || clickedMovie.poster_path,
                  "w500"
                )}
                mainPoster={makeImagePath(clickedMovie.poster_path, "w200")}
                back={`/${sortMenu === "movies" ? "" : sortMenu}`}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export default Slider;
