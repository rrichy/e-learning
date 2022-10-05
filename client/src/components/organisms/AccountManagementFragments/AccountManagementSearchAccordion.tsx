import { Box, Collapse, Paper, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import {
  ConditionalDateRange,
  Selection,
  TextField,
} from "@/components/molecules/LabeledHookForms";
import DateRange from "@/components/atoms/HookForms/DateRange";
import { Selection as ASelection } from "@/components/atoms/HookForms";
import Labeler from "@/components/molecules/Labeler";
import { OptionAttribute } from "@/interfaces/CommonInterface";

function AccountManagementSearchAccordion({
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
        Search Accounts
      </Button>
      <Collapse in={open}>
        <Paper
          variant="outlined"
          sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          <Stack spacing={2} alignItems="center">
            <Selection
              name="category_id"
              label="Account info"
              options={categories}
            />
            <TextField
              name="title"
              label="User info"
              placeholder="Name"
            />
            <TextField
              name="title"
              placeholder="Mail Address"
            />
            <TextField
              name="title"
              placeholder="Remarks"
            />
            <Selection
              name="category_id"
              label="Course info"
              options={categories}
            />
            <Labeler label="Registered date">
              <DateRange 
                minDateProps={{ name: "registered_date_from" }} 
                maxDateProps={{ name: "registered_date_to" }} 
              />
            </Labeler>
            <ConditionalDateRange
              label="Last login day"
              radioName="is_whole_period"
              radioLabel="Not yet logged in"
              radioValue={1}
              dateRangeValue={0}
              DateRangeProps={{
                minDateProps: { name: "start_period" },
                maxDateProps: { name: "end_period" },
              }}
            />
            <Labeler label="Display Number of Results">
              <Stack direction="row" spacing={2}>
                <ASelection name="page_count" label="Results" />
                <ASelection name="order" label="Order" />
              </Stack>
            </Labeler>
          </Stack>
          <Stack direction="row" spacing={2} p={3} justifyContent="center">
            <Button large rounded color="dull" variant="outlined" type="button">
              コース名
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

export default AccountManagementSearchAccordion;
