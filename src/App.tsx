import { AppBar, Toolbar, Typography, Grid } from "@mui/material";
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
  return aggregatedByAuthor;
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
      <Grid container>
        <Grid item md={12} lg={6}>
          <ReactECharts
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
                bottom: "3%",
                containLabel: true,
              },
              dataset: {
                source: aggregatedByTime.map(([category, value]) => {
                  return { category, value };
                }),
              },
              xAxis: [
                {
                  type: "category",
                  axisTick: {
                    alignWithLabel: true,
                  },
                },
              ],
              yAxis: [
                {
                  type: "value",
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
                },
              ],
            }}
          />
        </Grid>
        <Grid item md={12} lg={6}>
          <ReactECharts
            option={{
              title: {
                text: "Prominent Authors",
                subtext: "By Topic of Interest",
                left: "center",
              },
              tooltip: {
                trigger: "item",
              },
              legend: {
                orient: "horizontal",
                right: "center",
                bottom: "bottom",
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
    </>
  );
}
