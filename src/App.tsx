import { AppBar, Toolbar, Typography, Grid, TextField } from "@mui/material";
import { rollups } from "d3-array";
import ReactECharts from "echarts-for-react";
import { getDummyData } from "./utils";
import type { Publication } from "./utils";

function getBarChartData(
  data: Publication[],
  granularity?: "year" | "month" | "week"
): [string, number][] {
  const aggregatedByTime = rollups(
    data,
    (vals) => {
      return vals.length;
    },
    (val) => {
      return new Date(val.publicationDate).getFullYear().toString();
    }
  );
  return aggregatedByTime;
}

function getPieChartData(data: Publication[], filter?: string): [string, number][] {
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
  // Sort author by publication count
  aggregatedByAuthor.sort(([, a], [, b]) => {
    return a - b > 0 ? -1 : 1;
  });
  // getting top 10 authors only
  return aggregatedByAuthor.slice(0, 10);
}

export function App(): JSX.Element {
  const data = getDummyData();
  const aggregatedByTime = getBarChartData(data);
  const aggregatedByAuthor = getPieChartData(data);
  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            LitSearch
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container sx={{ padding: "1%" }}>
        <Grid container item xs={12} sm={12} md={12} lg>
          <ReactECharts
            style={{ height: "60vh", width: "100%" }}
            option={{
              title: {
                text: "Publications Timeline",
                subtext: "By Year",
                left: "center",
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "shadow",
                },
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "4%",
                containLabel: true,
              },
              dataset: [
                {
                  source: aggregatedByTime.map(([category, value]) => {
                    return { category, value };
                  }),
                },
                {
                  transform: {
                    type: "sort",
                    config: { dimension: "category", order: "asc" },
                  },
                },
              ],
              xAxis: [
                {
                  type: "category",
                  axisTick: {
                    alignWithLabel: true,
                  },
                  name: "Time",
                  nameLocation: "middle",
                  nameGap: 30,
                },
              ],
              yAxis: [
                {
                  type: "value",
                  name: "Publications Count",
                  nameLocation: "middle",
                  nameGap: 30,
                },
              ],
              series: [
                {
                  name: "Publications Count",
                  type: "bar",
                  showBackground: true,
                  barWidth: "60%",
                  encode: {
                    x: "category",
                    y: "value",
                  },
                  datasetIndex: 1,
                },
              ],
            }}
          />
        </Grid>
        <Grid container item xs={12} sm={12} md={12} lg direction="column" spacing={2}>
          <Grid container item>
            <TextField fullWidth label="Filter by keywords" type="search" />
          </Grid>
          <Grid container item>
            <ReactECharts
              style={{ height: "60vh", width: "100%" }}
              option={{
                color: [
                  "#a50026",
                  "#d73027",
                  "#f46d43",
                  "#fdae61",
                  "#fee090",
                  "#e0f3f8",
                  "#abd9e9",
                  "#74add1",
                  "#4575b4",
                  "#313695",
                ],
                title: {
                  text: "Top 10 Authors",
                  subtext: "By Topic of Interest",
                  left: "center",
                },
                tooltip: {
                  trigger: "item",
                },
                series: [
                  {
                    name: "Publications Distribution",
                    type: "pie",
                    radius: "50%",
                    data: aggregatedByAuthor.map(([name, value]) => {
                      return { name, value };
                    }),
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                      },
                    },
                  },
                ],
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
