import { AppBar, Toolbar, Typography } from "@mui/material";

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
    </>
  );
}
