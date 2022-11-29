import styled from "styled-components";
import {motion} from "framer-motion";
import {IMovie} from "../api";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar, faCircleXmark} from "@fortawesome/free-solid-svg-icons";

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 9999;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
`;
const BigMovie = styled(motion.div)<{scrollcenter: number}>`
  position: fixed;
  width: 50vw;
  top: 90px;
  height: 80vh;
  left: 0;
  right: 0;

  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;

  background-color: ${(props) => props.theme.black.darker};
  z-index: 99999;
  .xmark {
    position: absolute;
    right: 0;
    margin: 20px;
    font-size: 30px;
    opacity: 0.7;
    cursor: pointer;
  }
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 50px;
  img {
    width: 25%;
    margin-right: 20px;
  }
`;
const CoverRight = styled.div`
  width: 80%;
  height: 77%;
  position: relative;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 35px;
  width: 300px;
`;
const BigOverview = styled.p`
  padding: 10px 50px;
  position: relative;
  top: -55px;
  height: 30%;
  overflow: auto;
  line-height: 23px;
  color: ${(props) => props.theme.white.lighter};
  word-spacing: 3px;
`;
const IconGroups = styled.div`
  width: 150px;
  height: 50px;
  position: absolute;
  bottom: 0;
  /* margin: 200px 0 0 10px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const AgeInfo = styled.div<{isadult: boolean}>`
  width: 42px;
  height: 42px;
  background-color: ${(props) => (props.isadult ? props.theme.red : "#019267")};
  font-size: 25px;
  font-weight: 600;
  text-align: center;
  border-radius: 12px;
  line-height: 40px;
`;
const GradeScore = styled.div`
  display: flex;
  gap: 6px;
  width: 80px;
  height: 30px;
  border: solid 1px #fed049;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  color: #fed049;
`;
interface IMovieDetail {
  layoutId: string;
  back: string;
  clickedMovie: IMovie;
  scrollcenter: number;
  bgMoviePoster: string;
  mainPoster: string;
}

function DetailMovie({
  layoutId,
  back,
  clickedMovie,
  scrollcenter,
  bgMoviePoster,
  mainPoster,
}: IMovieDetail) {
  const navigate = useNavigate();
  const onOverlayClicked = () => navigate(back);

  return (
    <>
      <Overlay
        onClick={onOverlayClicked}
        exit={{opacity: "0"}}
        animate={{opacity: "1"}}
      />
      {clickedMovie && (
        <BigMovie
          layoutId={layoutId}
          scrollcenter={scrollcenter}
          style={{borderRadius: 15}}
        >
          <>
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="xmark"
              onClick={onOverlayClicked}
            />
            <BigCover
              style={{
                backgroundImage: `linear-gradient( to top , #181818, rgba(0,0,0,0.5) ), 
                url(
                  ${bgMoviePoster}
                  )`,
              }}
            >
              <img src={mainPoster} alt={clickedMovie.title}></img>
              <CoverRight>
                <BigTitle>{clickedMovie.title || clickedMovie.name}</BigTitle>
                <IconGroups>
                  <GradeScore>
                    <FontAwesomeIcon icon={faStar} />
                    <div>{clickedMovie.vote_average * 0.5}</div>
                  </GradeScore>
                  <div>
                    {clickedMovie.adult ? (
                      <AgeInfo isadult={true}>19</AgeInfo>
                    ) : (
                      <AgeInfo isadult={false}>15</AgeInfo>
                    )}
                  </div>
                </IconGroups>
              </CoverRight>
            </BigCover>

            <BigOverview>
              {clickedMovie.overview === ""
                ? "There is no Information!"
                : clickedMovie.overview}
            </BigOverview>
          </>
        </BigMovie>
      )}
    </>
  );
}
export default DetailMovie;
