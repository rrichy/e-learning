import { Box, Collapse, Paper, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMemo, useState } from "react";
import Button from "@/components/atoms/Button";
import {
  ConditionalDateRange,
  RadioGroup,
  Selection,
  TextField,
} from "@/components/molecules/LabeledHookForms";
import { OptionAttribute } from "@/interfaces/CommonInterface";
import { FormContainer, useForm } from "react-hook-form-mui";
import { getCacheableOptions } from "@/services/CommonService";
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
  const [open, setOpen] = useState(false);
  const { options, fetchingOptions } = getCacheableOptions("affiliations");

  const affiliations = useMemo(() => {
    if (fetchingOptions || !options?.affiliations)
      return [{ id: 0, name: "未選択" }];
    return [
      { id: 0, name: "未選択" },
      ...options.affiliations,
    ] as OptionAttribute[];
  }, [options?.affilations, fetchingOptions]);

  const form = useForm({
    mode: "onChange",
    defaultValues: initCourseAttendeeDefault,
    resolver: yupResolver(courseAttendeeSearchSchema),
  });

  const { isDirty, isValid } = form.formState;

  return (
    <Box>
      <Button
        variant="contained"
        sx={buttonStyle(open)}
        onClick={() => setOpen(!open)}
        endIcon={<ExpandMoreIcon fontSize="large" />}
      >
        受講者を検索
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
                options={affiliations}
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

const buttonStyle = (open: boolean) => {
  if (open)
    return {
      height: "60px !important",
      "& svg": {
        transition: "200ms transform",
        transform: "rotate(180deg)",
      },
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    };

  return {
    height: "60px !important",
    "& svg": {
      transition: "200ms transform",
    },
  };
};
