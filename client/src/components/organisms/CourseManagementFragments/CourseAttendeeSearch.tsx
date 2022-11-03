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
import { OptionAttribute } from "@/interfaces/CommonInterface";
import { FormContainer, useForm } from "react-hook-form-mui";
import { useQuery } from "@tanstack/react-query";
import { getOptions } from "@/services/CommonService";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CourseAttendeeSearchAttributes,
  courseAttendeeSearchSchema,
  initCourseAttendeeDefault,
} from "@/validations/SearchFormValidation";

function CourseAttendeeSearch({
  onSubmit,
}: {
  onSubmit: (r: CourseAttendeeSearchAttributes) => void;
}) {
  const { data: affiliations } = useQuery(
    ["affiliations"],
    async () => {
      const res = await getOptions(["affiliations"]);
      return [
        { id: 0, name: "未選択", selectionType: "disabled" },
        ...res.data.affiliations,
      ] as OptionAttribute[];
    },
    {
      staleTime: 10_000,
      refetchOnWindowFocus: false,
      placeholderData: [{ id: 0, name: "未選択", selectionType: "disabled" }],
    }
  );
  const form = useForm({
    mode: "onChange",
    defaultValues: initCourseAttendeeDefault,
    resolver: yupResolver(courseAttendeeSearchSchema),
  });
  const [open, setOpen] = useState(false);

  const { isDirty, isValid } = form.formState;

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
          <FormContainer
            formContext={form}
            handleSubmit={form.handleSubmit(onSubmit)}
          >
            <Stack spacing={2} alignItems="center">
              <Selection
                name="affiliation_id"
                label="所属"
                options={affiliations ?? []}
              />
              <TextField name="name" label="氏名" />
              <TextField name="email" label="メールアドレス" />
              <TextField name="remarks" label="備考" />
              <ConditionalDateRange
                label="最終ログイン日"
                radioName="never_logged_in"
                radioLabel="未ログイン"
                radioValue={1}
                dateRangeValue={2}
                DateRangeProps={{
                  minDateProps: { name: "logged_in_min_date" },
                  maxDateProps: { name: "logged_in_max_date" },
                }}
              />
              <RadioGroup
                name="narrowed_by"
                label="絞り込み"
                row={false}
                options={[
                  { id: 1, name: "受講期間内のみを表示" },
                  { id: 2, name: "受講期間外のみを表示" },
                  { id: 3, name: "全員を表示" },
                ]}
              />
            </Stack>
            <Stack direction="row" spacing={2} p={3} justifyContent="center">
              <Button
                large
                rounded
                color="dull"
                variant="outlined"
                type="button"
                onClick={() => {
                  form.reset(initCourseAttendeeDefault);
                  form.handleSubmit(onSubmit)();
                }}
              >
                クリア
              </Button>
              <Button
                large
                rounded
                color="secondary"
                variant="contained"
                disabled={!isDirty || !isValid}
              >
                検索
              </Button>
            </Stack>
          </FormContainer>
        </Paper>
      </Collapse>
    </Box>
  );
}

export default CourseAttendeeSearch;
