import { AppBar, Toolbar, Typography, List, ListItem, ListSubheader } from "@mui/material";
import { getDummyData } from "./utils";

export function App(): JSX.Element {
  const data = getDummyData();
  const topics = Array.from(
    new Set(
      data.map((ele) => {
        return ele.topic;
      })
    )
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
      <List subheader={<ListSubheader>Topics</ListSubheader>} dense>
        {topics.map((ele) => {
          return <ListItem>{ele}</ListItem>;
        })}
      </List>
    </>
  );
}
