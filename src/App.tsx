import { AppBar, Toolbar, Typography } from "@mui/material";
import { rollups } from "d3-array";
import { getDummyData } from "./utils";

export function App(): JSX.Element {
  const data = getDummyData();
  const aggregatedByYear = rollups(
    data,
    (vals) => {
      return vals.length;
    },
    (val) => {
      return new Date(val.publicationDate).getFullYear();
    }
  );
  const authors = data.flatMap((ele) => {
    return ele.authors;
  });
  const aggregatedByAuthor = rollups(
    authors,
    (vals) => {
      return vals.length;
    },
    (val) => val
  );
  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            LitSearch
          </Typography>
        </Toolbar>
      </AppBar>
      {JSON.stringify(aggregatedByYear, undefined, 2)}
      {JSON.stringify(aggregatedByAuthor, undefined, 2)}
    </>
  );
}
