import { CSVDropzone } from "@/components/atoms/HookForms";
import { Button, Divider, Paper, Stack, Typography } from "@mui/material";

function CSVForm() {
  return (
    <Paper variant="subpaper">
      <Typography
        variant="sectiontitle2"
        sx={{ transform: `translate(-8px, -8px)` }}
      >
        CSVファイルから登録
      </Typography>
      <Stack spacing={1} alignItems="flex-end">
        <CSVDropzone
          name="file"
          placeholder="ここにファイルをドロップします また ファイルを選択します"
        />
        <Divider sx={{ width: 1 }} />
        <Stack
          direction="row"
          spacing={2}
          width={1}
          p={1}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Typography variant="body2" fontWeight="bold">
            一括登録用のCSVテンプレート
          </Typography>
          <Button
            variant="contained"
            href="./csv_template.csv"
            download="一括登録用登録テンプレート"
            type="button"
            sx={{ borderRadius: 20 }}
          >
            ダウンロード
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default CSVForm;
