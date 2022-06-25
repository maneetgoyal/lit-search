import { AppBar, Toolbar, Typography } from "@mui/material";
import { rollups } from "d3-array";
import { getDummyData } from "./utils";

export function App(): JSX.Element {
  const data = getDummyData();
  const aggregated = rollups(
    data,
    (vals) => {
      return vals.length;
    },
    (val) => {
      return new Date(val.publicationDate).getFullYear();
    }
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
      {JSON.stringify(aggregated, undefined, 2)}
    </>
  );
}
