import { Divider, Paper, Stack, Typography } from "@mui/material";
import Button from "../../atoms/Button";
import Labeler from "../../molecules/Labeler";
import CommonProfile from "../../organisms/Student/CommonProfile";
import useAuth from "@/hooks/useAuth";
import Link from "@/components/atoms/Link";

function ChangePlan() {
  const { authData } = useAuth();
  
  return (
    <Stack spacing={3} direction={{ xs: "column", lg: "row"}}>
      <CommonProfile
        name={authData?.name}
        image={authData?.image}
        plan={authData?.created_at}
        registered_date={authData?.created_at}
      />
      
      <Stack spacing={3} flex={1}>
        <Paper variant="softoutline" sx={{ p: 7 }}>
          <Typography variant="sectiontitle2">現在のプラン</Typography>
          <Stack spacing={3} pt={5}>
            <Labeler label="ステータス">
              <Typography>1ヶ月プラン</Typography>
            </Labeler>
            <Labeler label="次回更新日">
              <Typography>1999年04月01日</Typography>
            </Labeler>
            <Labeler label="決済方法">
              <Typography>VISA <Link to="/#" flex={1}>決済方法を変更する</Link></Typography>
            </Labeler>
          </Stack>
        </Paper>
        <Paper variant="softoutline" sx={{ p: 7 }}>
          <Stack spacing={1}>
            <Typography variant="sectiontitle2">ご利用プランの変更</Typography>
            <Typography>※変更の反映は、次回更新日以降に適用されます。</Typography>
            <Stack pt={3} direction="row" m={{ xs: 2, md: 4 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: "32px !important",
                  flex: 1,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                <Stack direction="row" justifyContent="space-between" pb={2}>
                  <Typography variant="h5" fontWeight={700}><span style={{ color: "#00c2b2" }}>1ヶ月</span>プラン</Typography>
                  <Stack direction="row" alignItems="flex-end">
                    <Typography variant="h5" fontWeight={700}>9,980</Typography>
                    <Typography fontSize={14}>円（税込）</Typography>
                  </Stack>
                </Stack>
                <Divider />
                <Typography pt={2} fontSize={13}>プランの説明文が入ります。プランの説明文が入ります。プランの説明文が入ります。プランの説明文が入ります。プランの説明文が入ります。</Typography>
              </Paper>
              <Button
                type="button"
                color="secondary"
                sx={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  borderLeftWidth: 0,
                  bgcolor: "#fff",
                  flexGrow: 0,
                  p: 2,
                  maxWidth: "fit-content",
                }}
              >
                ご利用中
              </Button>
            </Stack>

            <Stack pt={3} direction="row" m={{ xs: 2, md: 4 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: "32px !important",
                  flex: 1,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                <Stack direction="row" justifyContent="space-between" pb={2}>
                  <Typography variant="h5" fontWeight={700}><span style={{ color: "#00c2b2" }}>3ヶ月</span>プラン</Typography>
                  <Stack alignItems="flex-end" spacing={1}>
                    <Stack direction="row" alignItems="flex-end">
                      <Typography variant="h5" fontWeight={700}>6,980</Typography>
                      <Typography fontSize={14}>円（税込）/1ヶ月あたり</Typography>
                    </Stack>
                    <Typography fontSize={13}>※お支払いは、3ヶ月分の20,700円（税込）一括払いとなります。</Typography>
                  </Stack>
                </Stack>
                <Divider />
                <Typography pt={2} fontSize={13}>プランの説明文が入ります。プランの説明文が入ります。プランの説明文が入ります。プランの説明文が入ります。プランの説明文が入ります。</Typography>
              </Paper>
              <Button
                type="button"
                color="secondary"
                sx={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  borderLeftWidth: 0,
                  bgcolor: "#fff",
                  flexGrow: 0,
                  p: 2,
                  maxWidth: "fit-content",
                }}
              >
                変更する
              </Button>
            </Stack>

            <Stack pt={3} direction="row" m={{ xs: 2, md: 4 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: "32px !important",
                  flex: 1,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                <Stack direction="row" justifyContent="space-between" pb={2}>
                  <Typography variant="h5" fontWeight={700}><span style={{ color: "#00c2b2" }}>6ヶ月</span>プラン</Typography>
                  <Stack alignItems="flex-end" spacing={1}>
                    <Stack direction="row" alignItems="flex-end">
                      <Typography variant="h5" fontWeight={700}>4,980</Typography>
                      <Typography fontSize={14}>円（税込）/1ヶ月あたり</Typography>
                    </Stack>
                    <Typography fontSize={13}>※お支払いは、3ヶ月分の29,400円（税込）一括払いとなります。</Typography>
                  </Stack>
                </Stack>
                <Divider />
                <Typography pt={2} fontSize={13}>プランの説明文が入ります。プランの説明文が入ります。プランの説明文が入ります。プランの説明文が入ります。プランの説明文が入ります。</Typography>
              </Paper>
              <Button
                type="button"
                color="secondary"
                sx={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  borderLeftWidth: 0,
                  bgcolor: "#fff",
                  flexGrow: 0,
                  p: 2,
                  maxWidth: "fit-content",
                }}
              >
                変更する
              </Button>
            </Stack>

            <Stack pt={3} direction="row" m={{ xs: 2, md: 4 }}>
              <Link to="/#" flex={1} align="center">退会する</Link>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
      
    </Stack>
  );
}

export default ChangePlan;