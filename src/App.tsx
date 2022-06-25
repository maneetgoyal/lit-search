import { AppBar, Toolbar, Typography } from "@mui/material";
import { getDummyData } from "./utils";

export function App(): JSX.Element {
  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            LitSearch
          </Typography>
        </Toolbar>
      </AppBar>
      {getDummyData().map((ele) => {
        return JSON.stringify(ele, undefined, 2);
      })}
    </>
  );
}
