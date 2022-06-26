import { AppBar, Toolbar, Typography, Grid, TextField, Button } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useState, useEffect } from "react";
import {
  getDummyData,
  getBarChartData,
  getPieChartData,
  getXAxisLabel,
  getSubtitle,
} from "./utils";
import type { Publication, Datum } from "./utils";
import type { TextFieldProps } from "@mui/material";
import type { DefaultLabelFormatterCallbackParams } from "echarts";

export function App(): JSX.Element {
  const [filter, setFilter] = useState("");
  const [data, setData] = useState<Publication[]>([]);
  const [year, setYear] = useState<string>();
  const [month, setMonth] = useState<string>();
  useEffect(() => {
    const dummyData = getDummyData();
    setData(dummyData);
  }, []);
  const aggregatedByTime = getBarChartData(data, year, month);
  const aggregatedByAuthor = getPieChartData(data, filter);
  const onFilterChange: TextFieldProps["onChange"] = (evt) => {
    const { value } = evt.target;
    setFilter(value);
  };
  const onChartClick = (params: DefaultLabelFormatterCallbackParams) => {
    if (params.componentType === "series" && params.componentSubType === "bar") {
      const datum = params.data as Datum;
      if (year === undefined) {
        setYear(datum.category);
      } else if (month === undefined) {
        setMonth(datum.category);
      }
    }
  };
  const onBackClick = () => {
    if (year !== undefined) {
      if (month !== undefined) {
        setMonth(undefined);
      } else {
        setYear(undefined);
      }
    }
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
        <Grid container sx={{ padding: "1%" }} spacing={2}>
          <Grid container item xs={12} sm={12} md={12} lg direction="column" spacing={2}>
            <Grid container item>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                disabled={year === undefined}
                onClick={onBackClick}
              >
                Go Back
              </Button>
            </Grid>
            <Grid container item>
              <ReactECharts
                style={{ height: "60vh", width: "100%" }}
                option={{
                  title: {
                    text: "Publications Timeline",
                    subtext: getSubtitle(year, month),
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
                      name: getXAxisLabel(year, month),
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
                onEvents={{
                  click: onChartClick,
                }}
              />
            </Grid>
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
                lazyUpdate
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
                      name: "Publications Count",
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
