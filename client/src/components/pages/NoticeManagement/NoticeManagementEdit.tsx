import { Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import { FormContainer, useForm } from "react-hook-form-mui";
import {
  Selection,
  TextField,
  CheckboxGroup,
} from "../../molecules/LabeledHookForms";
import DateRange from "@/components/atoms/HookForms/DateRange";
import Labeler from "@/components/molecules/Labeler";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import useConfirm from "@/hooks/useConfirm";
import useAlerter from "@/hooks/useAlerter";
import { useCacheableOptions } from "@/services/CommonService";
import {
  NoticeFormAttribute,
  noticeFormInit,
  noticeFormSchema,
} from "@/validations/NoticeFormValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { showNotice, updateNotice } from "@/services/NoticeService";
import { useQuery } from "@tanstack/react-query";

function NoticeManagementEdit() {
  const navigate = useNavigate();
  const { isConfirmed } = useConfirm();
  const { successSnackbar, errorSnackbar, handleError } = useAlerter();
  const { noticeId } = useParams();

  const form = useForm<NoticeFormAttribute>({
    mode: "onChange",
    defaultValues: noticeFormInit,
    resolver: yupResolver(noticeFormSchema),
  });

  const { options, fetchingOptions } = useCacheableOptions("signatures");
  const { isLoading, isFetching } = useQuery(
    ["notice-details", +noticeId!],
    () => showNotice(+noticeId!),
    {
      enabled: !!noticeId,
      refetchOnWindowFocus: false,
      onSuccess: (res) => form.reset(res.data.data),
      onError: (e: any) => errorSnackbar(e.message),
    }
  );

  const handleSubmit = form.handleSubmit(
    async (raw: NoticeFormAttribute) => {
      const confirmed = await isConfirmed({
        title: "confirm notice",
        content: "confirm notice",
      });

      if (confirmed) {
        try {
          const res = await updateNotice(+noticeId!, raw);
          successSnackbar(res.data.message);
          navigate("/notice-management");
        } catch (e: any) {
          handleError(e, form);
        }
      }
    },
    (a, b) => console.log({ a, b, data: form.getValues() })
  );

  const {
    formState: { isSubmitting, isValid, isDirty },
  } = form;

  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <Typography variant="sectiontitle2">?????????????????????</Typography>
        <DisabledComponentContextProvider
          showLoading
          value={fetchingOptions || isLoading || isFetching || isSubmitting}
        >
          <FormContainer formContext={form} handleSubmit={handleSubmit}>
            <Stack spacing={2} p={2} alignItems="center">
              <TextField name="subject" label="??????" />
              <TextField name="content" label="??????" multiline rows={3} />
              <CheckboxGroup
                name="posting_method"
                label="????????????"
                row={false}
                options={[
                  { id: 1, name: "??????????????????" },
                  { id: 2, name: "???????????????" },
                ]}
              />
              <Labeler label="????????????">
                <DateRange
                  minDateProps={{ name: "date_publish_start" }}
                  maxDateProps={{ name: "date_publish_end" }}
                />
              </Labeler>
              <Selection
                name="signature_id"
                label="??????"
                options={[
                  { id: 0, name: "?????????", selectionType: "disabled" },
                  ...(options?.signatures ?? []),
                ]}
              />
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
              <Button
                color="dull"
                variant="outlined"
                rounded
                large
                type="button"
                to="/notice-management"
              >
                ???????????????
              </Button>
              <Button
                color="secondary"
                variant="contained"
                rounded
                large
                type="submit"
                disabled={!(isValid && isDirty)}
              >
                ??????
              </Button>
            </Stack>
          </FormContainer>
        </DisabledComponentContextProvider>
      </Stack>
    </Paper>
  );
}

export default NoticeManagementEdit;
