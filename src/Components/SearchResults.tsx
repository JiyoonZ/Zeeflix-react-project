import styled from "styled-components";
import {motion} from "framer-motion";
import {makeImagePath} from "../utils";
import {IGetSearchResults} from "../api";
import {useNavigate} from "react-router-dom";

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
interface ISearchResults {
  datas: IGetSearchResults;
  keyword: string;
  title: string;
}
function SearchResults({datas, keyword, title}: ISearchResults) {
  const navigate = useNavigate();
  const onBoxClicked = (movieId: string) => {
    navigate(`/search/${movieId}?keyword=${keyword}`);
  };

  return (
    <>
      <MenuTitle>{title} Results</MenuTitle>
      <ResultsBox>
        {datas?.results.slice(0, 12).map((data) => (
          <Box
            onClick={() => onBoxClicked(data.id + "")}
            bgpath={makeImagePath(data.backdrop_path, "w300")}
            variants={BoxVars}
            whileHover="hover"
            initial="normal"
            transition={{type: "tween"}}
            key={data.id}
            layoutId={data.id + "_" + keyword}
          >
            <Info variants={infoVars}>
              <h1>{data?.title || data?.name}</h1>
            </Info>
          </Box>
        ))}
      </ResultsBox>
    </>
  );
}

export default SearchResults;
