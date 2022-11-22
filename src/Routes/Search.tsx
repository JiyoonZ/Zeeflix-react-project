import {useLocation, useParams} from "react-router-dom";

function Search() {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("keyword");
  console.log(search);
  return null;
}

export default Search;
