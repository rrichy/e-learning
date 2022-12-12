import { Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import Labeler from "../../molecules/Labeler";
import CommonProfile from "../../organisms/Student/CommonProfile";
import useAuth from "@/hooks/useAuth";
import Link from "@/components/atoms/Link";

function OptionApplication() {
  const { authData } = useAuth();

  return (
    <Stack spacing={3} direction={{ xs: "column", lg: "row" }}>
      <CommonProfile
        name={authData?.name}
        image={authData?.image}
        plan={authData?.created_at}
        registered_date={authData?.created_at}
      />

      <Stack spacing={3} flex={1}>
        <Paper variant="softoutline" sx={{ p: 7 }}>
          <Typography variant="sectiontitle2">現在のオプション</Typography>
          <Stack spacing={3} pt={5}>
            <Labeler label="ステータス">
              <Typography>1ヶ月プラン</Typography>
            </Labeler>
            <Labeler label="次回更新日">
              <Typography>1999年04月01日</Typography>
            </Labeler>
            <Labeler label="決済方法">
              <Typography>
                VISA{" "}
                <Link to="/#" flex={1}>
                  決済方法を変更する
                </Link>
              </Typography>
            </Labeler>
          </Stack>
        </Paper>
        <Paper variant="softoutline" sx={{ p: 7 }}>
          <Stack spacing={1}>
            <Typography variant="sectiontitle2">
              オプションのお申込み
            </Typography>
            <Typography>※次回更新日以降に適用されます。</Typography>
            <Stack pt={3} direction="row" m={{ xs: 2, md: 4 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: "32px !important",
                  flex: 1,
                }}
              >
                <Stack direction="row" justifyContent="space-between" pb={2}>
                  <Typography variant="h5" fontWeight={700}>
                    個別学習サポート <Chip label="ご利用中" color="secondary" />
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    ￥xx,xxx
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between" pt={2}>
                  <Typography>
                    ✔ サポート内容
                    <br />✔ サポート内容
                    <br />✔ サポート内容
                    <br />
                  </Typography>
                  <Typography>￥xxx / 月</Typography>
                </Stack>
              </Paper>
            </Stack>

            <Stack pt={3} direction="row" m={{ xs: 2, md: 4 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: "32px !important",
                  flex: 1,
                }}
              >
                <Stack direction="row" justifyContent="space-between" pb={2}>
                  <Typography variant="h5" fontWeight={700}>
                    個別学習サポート
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    ￥xx,xxx
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between" pt={2}>
                  <Typography>
                    ✔ サポート内容
                    <br />✔ サポート内容
                    <br />✔ サポート内容
                    <br />
                  </Typography>
                  <Typography>￥xxx / 月</Typography>
                </Stack>
              </Paper>
            </Stack>

            <Stack pt={3} direction="row" m={{ xs: 2, md: 4 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: "32px !important",
                  flex: 1,
                }}
              >
                <Stack direction="row" justifyContent="space-between" pb={2}>
                  <Typography variant="h5" fontWeight={700}>
                    個別学習サポート
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    ￥xx,xxx
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between" pt={2}>
                  <Typography>
                    プランの説明文が入ります。プランの説明文が入ります。
                  </Typography>
                  <Typography>￥xxx / 月</Typography>
                </Stack>
              </Paper>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
}

export default OptionApplication;
