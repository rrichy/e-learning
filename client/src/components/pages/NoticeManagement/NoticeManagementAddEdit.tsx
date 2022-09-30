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
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OptionAttribute } from "@/interfaces/CommonInterface";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { yupResolver } from "@hookform/resolvers/yup";
import { getOptions } from "@/services/CommonService";
import {
  showNotice,
  storeNotice,
  updateNotice,
} from "@/services/NoticeService";
import {
  NoticeFormAttribute,
  noticeFormInit,
  noticeFormSchema,
} from "@/validations/NoticeFormValidation";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";

function NoticeManagementAdd() {
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const { noticeId } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [signatures, setSignatures] = useState<OptionAttribute[]>([
    { id: 0, name: "未選択", selectionType: "disabled" },
  ]);
  const { successSnackbar, errorSnackbar, handleError } = useAlerter();
  const { isConfirmed } = useConfirm();
  const form = useForm<NoticeFormAttribute>({
    mode: "onChange",
    defaultValues: noticeFormInit,
    resolver: yupResolver(noticeFormSchema),
  });

  const {
    formState: { isSubmitting, isValid, isDirty },
  } = form;

  const isCreate =
    pathname
      .split("/")
      .filter((a) => a)
      .pop() === "create";

  const handleSubmit = form.handleSubmit(
    async (raw: NoticeFormAttribute) => {
      const confirmed = await isConfirmed({
        title: "confirm notice",
        content: "confirm notice",
      });

      if (confirmed) {
        try {
          const res = await (isCreate
            ? storeNotice(raw)
            : updateNotice(+noticeId!, raw));
          successSnackbar(res.data.message);
          navigate("/notice-management");
        } catch (e: any) {
          handleError(e, form);
        }
      }
    },
    (a, b) => console.log({ a, b, data: form.getValues() })
  );

  useEffect(() => {
    mounted.current = true;

    (async () => {
      try {
        const promise = [getOptions(["signatures"])];

        if (!isCreate) promise.push(showNotice(+noticeId!));
        const res = await Promise.all(promise);

        setSignatures([
          { id: 0, name: "未選択", selectionType: "disabled" },
          ...res[0].data.signatures,
        ]);

        if (!isCreate) form.reset(res[1].data.data);
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setInitialized(true);
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, [state, noticeId, isCreate]);

  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <Typography variant="sectiontitle2">
          お知らせを{isCreate ? "登録" : "編集"}
        </Typography>
        <DisabledComponentContextProvider
          showLoading
          value={!initialized || isSubmitting}
        >
          <FormContainer formContext={form} handleSubmit={handleSubmit}>
            <Stack spacing={2} p={2} alignItems="center">
              <TextField name="subject" label="件名" />
              <TextField name="content" label="内容" multiline rows={3} />
              <CheckboxGroup
                name="posting_method"
                label="掲載方法"
                row={false}
                options={[
                  { id: 1, name: "お知らせ掲示" },
                  { id: 2, name: "メール配信" },
                ]}
              />
              <Labeler label="掲載期間">
                <DateRange
                  minDateProps={{ name: "date_publish_start" }}
                  maxDateProps={{ name: "date_publish_end" }}
                />
              </Labeler>
              <Selection
                name="signature_id"
                label="署名"
                options={signatures}
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
                キャンセル
              </Button>
              <Button
                color="secondary"
                variant="contained"
                rounded
                large
                type="submit"
                disabled={!(isValid && isDirty)}
              >
                {isCreate ? "登録" : "編集"}
              </Button>
            </Stack>
          </FormContainer>
        </DisabledComponentContextProvider>
      </Stack>
    </Paper>
    // <Stack justifyContent="space-between">
    //   <Container>
    //     <Stack spacing={3} sx={{ p: 3 }}>
    //       <FormContainer>
    //         <Paper variant="softoutline" sx={{ p: 6 }}>
    //           <Stack spacing={3}>
    //             {/* <Typography
    //               fontWeight="bold"
    //               variant="h6"
    //               pl={1}
    //               sx={{ borderLeft: "5px solid #00c2b2" }}
    //             >
    //               コースを作成
    //             </Typography> */}

    //             <Card>
    //               <CardHeader
    //                 title="お知らせ登録"
    //                 sx={{
    //                   fontWeight: "bold",
    //                   background: "#000000",
    //                   color: "#ffffff",
    //                   fontSize: "1.25rem",
    //                 }}
    //               />
    //               <CardContent>
    //                 <Stack spacing={2}>
    //                   <TextField
    //                     name="subject"
    //                     label="Subject Name"
    //                     placeholder="Subject Name"
    //                   />
    //                   <TextField
    //                     name="content"
    //                     label="content"
    //                     placeholder="content"
    //                     multiline
    //                     rows={3}
    //                   />
    //                   <RadioGroup
    //                     name="gender"
    //                     label="Posting method"
    //                     row={false}
    //                     options={[
    //                       { id: 1, name: "post notice" },
    //                       { id: 2, name: "Deliver mail" },
    //                     ]}
    //                   />
    //                   <RadioGroup
    //                     name="target"
    //                     label="Target"
    //                     row={false}
    //                     options={[
    //                       { id: 1, name: "everyone" },
    //                       { id: 2, name: "group" },
    //                       { id: 3, name: "individual" },
    //                       { id: 4, name: "course" },
    //                     ]}
    //                   />
    //                   <DatePicker
    //                     name="birthday"
    //                     label="posting period"
    //                     maxDate={new Date()}
    //                   />
    //                   <DatePicker
    //                     name="birthday"
    //                     maxDate={new Date()}
    //                   />
    //                   <Selection name="sex" label="signature" />
    //                 </Stack>
    //               </CardContent>
    //             </Card>
    //           </Stack>

    //           <Stack direction="row" spacing={2} pt={5} justifyContent="center">
    //             {/* <Button large color="inherit" variant="outlined" sx={{ borderRadius: 7 }}>キャンセル</Button> */}
    //             <Button large color="warning" variant="contained" sx={{ borderRadius: 7 }}>Cancel</Button>
    //             <Button large variant="contained" sx={{ borderRadius: 7 }}>Confirmation</Button>
    //           </Stack>
    //         </Paper>
    //       </FormContainer>
    //     </Stack>
    //   </Container>
    // </Stack>
  );
}

export default NoticeManagementAdd;
