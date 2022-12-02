import { Box, Collapse, Paper, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import {
  ConditionalDateRange,
  RadioGroup,
  Selection,
  TextField,
} from "@/components/molecules/LabeledHookForms";
import { Selection as ASelection } from "@/components/atoms/HookForms";
import Labeler from "@/components/molecules/Labeler";
import { OptionAttribute } from "@/interfaces/CommonInterface";

function CourseManagementSearchAccordion({
  categories,
}: {
  categories: OptionAttribute[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button
        variant="contained"
        sx={{
          height: "60px !important",
          "& svg": {
            transition: "200ms transform",
            ...(open ? { transform: "rotate(180deg)" } : {}),
          },
          ...(open
            ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
            : {}),
        }}
        onClick={() => setOpen(!open)}
        endIcon={<ExpandMoreIcon fontSize="large" />}
      >
        検索ボックスを開く
      </Button>
      <Collapse in={open}>
        <Paper
          variant="outlined"
          sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          <Stack spacing={2} alignItems="center">
            <Selection
              name="category_id"
              label="カテゴリー"
              options={categories}
            />
            <TextField
              name="title"
              label="コースタイトル"
              placeholder="コースタイトル"
            />
            <ConditionalDateRange
              label="受講期間"
              radioName="is_whole_period"
              radioLabel="全期間"
              radioValue={1}
              dateRangeValue={0}
              DateRangeProps={{
                minDateProps: { name: "start_period" },
                maxDateProps: { name: "end_period" },
              }}
            />
            <RadioGroup
              label="受講対象"
              name="target"
              row={false}
              options={[
                { id: 1, name: "全員" },
                { id: 2, name: "グループ" },
                { id: 3, name: "個別" },
              ]}
            />
            <RadioGroup
              name="narrow_down"
              label="絞り込み"
              row={false}
              options={[
                { id: 1, name: "今後開催予定のコース" },
                { id: 2, name: "現在受講可能なコース" },
                { id: 3, name: "すべて" },
              ]}
            />
            <Labeler label="表示件数">
              <ASelection name="page_count" label="表示件数" />
              <ASelection name="order" label="件" />
            </Labeler>
          </Stack>
          <Stack direction="row" spacing={2} p={3} justifyContent="center">
            <Button large rounded color="dull" variant="outlined" type="button">
              キャンセル
            </Button>
            <Button large rounded color="secondary" variant="contained">
              検索
            </Button>
          </Stack>
        </Paper>
      </Collapse>
    </Box>
  );
}

export default CourseManagementSearchAccordion;
