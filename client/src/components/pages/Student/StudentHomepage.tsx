import { NavigateNext } from "@mui/icons-material";
import { Grid, Link, Paper, Stack, Typography } from "@mui/material";
import React from "react";

function Notice() {
  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Grid container>
          <Grid item xs={12} md={3}>
            <Stack
              direction={{ xs: "row", md: "column" }}
              justifyContent="space-between"
            >
              <Typography
                id="notice"
                variant="sectiontitle2"
                fontWeight="bold"
                gutterBottom
              >
                お知らせ
              </Typography>
              <Link
                component="button"
                underline="hover"
                color="common.black"
                display="flex"
                alignItems="center"
                fontWeight="bold"
              >
                もっと見る
                <NavigateNext color="primary" />
              </Link>
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            md={9}
            sx={{ "div:not(:nth-last-of-type(1))": { mb: 1 } }}
          >
            <Stack direction="row" spacing={2}>
              <Typography whiteSpace="nowrap">2021年00月00日</Typography>
              <Link
                component="button"
                color="secondary"
                textAlign="left"
                underline="hover"
              >
                お知らせのタイトルテキストが入ります。お知らせのタイトルテキストが入ります。
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
}

export default Notice;
