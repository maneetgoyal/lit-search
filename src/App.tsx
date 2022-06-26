import { AppBar, Toolbar, Typography, Grid, TextField } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useState, useEffect } from "react";
import { getDummyData, getBarChartData, getPieChartData } from "./utils";
import type { Publication } from "./utils";
import type { TextFieldProps } from "@mui/material";

export function App(): JSX.Element {
  const [filter, setFilter] = useState("");
  const [data, setData] = useState<Publication[]>([]);
  useEffect(() => {
    const dummyData = getDummyData();
    setData(dummyData);
  }, []);
  const aggregatedByTime = getBarChartData(data);
  const aggregatedByAuthor = getPieChartData(data, filter);
  const onFilterChange: TextFieldProps["onChange"] = (evt) => {
    const { value } = evt.target;
    setFilter(value);
  };
  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            LitSearch
          </Typography>
        </Toolbar>
      </AppBar>
      {data.length > 0 ? (
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
              <TextField
                fullWidth
                label="Filter by keywords"
                type="search"
                onChange={onFilterChange}
                helperText="E.g. cell, disease, oncology, etc."
              />
            </Grid>
            <Grid container item>
              <ReactECharts
                style={{ height: "60vh", width: "100%" }}
                option={{
                  color: [
                    "#8dd3c7",
                    "#ffffb3",
                    "#bebada",
                    "#fb8072",
                    "#80b1d3",
                    "#fdb462",
                    "#b3de69",
                    "#fccde5",
                    "#d9d9d9",
                    "#bc80bd",
                  ],
                  title: {
                    text: "Top 10 Authors",
                    subtext: "Filtered by Topic of Interest",
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
      ) : null}
    </>
  );
}
