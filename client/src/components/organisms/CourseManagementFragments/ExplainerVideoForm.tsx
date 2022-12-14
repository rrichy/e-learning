import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import {
  Control,
  // Controller,
  useFieldArray,
  useFormContext,
} from "react-hook-form-mui";
import { TextField } from "../../molecules/LabeledHookForms";
import { useEffect, useState } from "react";
import MUIRichTextEditor from "mui-rte";
import { VideoAttributes, videoInit } from "@/validations/CourseFormValidation";
import { Close, Delete } from "@mui/icons-material";
// import { convertToRaw } from "draft-js";
import { RichTextEditor, VideoDropzone } from "@/components/atoms/HookForms";
import ReactPlayer from "react-player";
import { getTemporaryVideoUrl } from "@/services/AuthService";

function ExplainerVideoForm({
  returnFn,
  control,
  chapterIndex,
}: {
  returnFn: () => void;
  control: Control<{ videos: VideoAttributes[] }>;
  chapterIndex: number;
}) {
  const [dialog, setDialog] = useState<{
    header: string;
    video: VideoAttributes;
  } | null>(null);
  const {
    formState: { isDirty },
    getValues,
  } = useFormContext<{ videos: VideoAttributes[] }>();

  const { fields, append, remove } = useFieldArray({
    name: "videos",
    control,
    keyName: "fieldKey",
  });

  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <Typography variant="sectiontitle2">解説動画を作成</Typography>

        {fields.map(({ fieldKey, ...video }, index) => (
          <Paper variant="sectionsubpaper" key={fieldKey}>
            <Typography variant="sectiontitle3">{`${chapterIndex + 1}-${
              index + 1
            } 解説動画`}</Typography>
            <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
              <Typography variant="sectiontitle2">解説動画情報</Typography>
              <Stack spacing={2} p={2} alignItems="center">
                <TextField
                  name={`videos.${index}.title`}
                  label="解説動画タイトル"
                />
                <RichTextEditor name={`videos.${index}.content`} />
                {/* <Controller
                  name={`videos.${index}.content`}
                  render={({ field: { value, onChange } }) => {
                    const [isDirtyRTE, setIsDirtyRTE] = useState(false);

                    return (
                      <MUIRichTextEditor
                        defaultValue={value}
                        label="Type something here..."
                        controls={[
                          "title",
                          "bold",
                          "italic",
                          "underline",
                          "strikethrough",
                          "highlight",
                          "undo",
                          "redo",
                          "link",
                          "numberList",
                          "bulletList",
                          "quote",
                          "code",
                          "clear",
                          "my-save",
                        ]}
                        onChange={(state) => {
                          const newValue = JSON.stringify(
                            convertToRaw(state.getCurrentContent())
                          );
                          setIsDirtyRTE(newValue !== value);
                        }}
                        customControls={[
                          {
                            name: "my-save",
                            icon: (
                              <Save
                                color={isDirtyRTE ? "primary" : "inherit"}
                              />
                            ),
                            type: "callback",
                            onClick: (state) =>
                              onChange(
                                JSON.stringify(
                                  convertToRaw(state.getCurrentContent())
                                )
                              ),
                          },
                        ]}
                      />
                    );
                  }}
                /> */}
                <VideoDropzone name={`videos.${index}.video_file_path`} />
              </Stack>
            </Paper>
            <Stack
              direction="row"
              justifyContent="flex-end"
              m={{ xs: 2, md: 4 }}
              spacing={1}
            >
              <Button
                type="button"
                color="secondary"
                startIcon={<Delete />}
                onClick={() => remove(index)}
                sx={{
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  bgcolor: "#fff",
                  flexGrow: 0,
                  maxWidth: "fit-content",
                }}
              >
                削除
              </Button>
              <Button
                type="button"
                color="secondary"
                onClick={() =>
                  setDialog({
                    header: `${chapterIndex + 1}-${index + 1} 解説動画`,
                    video: getValues(`videos.${index}`),
                  })
                }
                sx={{
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  bgcolor: "#fff",
                  flexGrow: 0,
                  maxWidth: "fit-content",
                }}
              >
                プレビュー
              </Button>
            </Stack>
          </Paper>
        ))}

        <Button
          type="button"
          variant="contained"
          color="secondary"
          rounded
          sx={{ alignSelf: "flex-end", maxWidth: "fit-content" }}
          onClick={() => append(videoInit)}
        >
          解説動画を追加 ✙
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
        <Button
          color="dull"
          variant="outlined"
          rounded
          large
          type="button"
          onClick={returnFn}
        >
          キャンセル
        </Button>
        <Button
          color="secondary"
          variant="contained"
          rounded
          large
          type="submit"
          // onClick={() => editorRef.current?.save()}
          // disabled={!(isDirty && isValid)}
          disabled={!isDirty}
        >
          章末テストを作成
        </Button>
      </Stack>

      <PreviewVideoSection onClose={() => setDialog(null)} data={dialog} />
    </Paper>
  );
}

export default ExplainerVideoForm;

function PreviewVideoSection({
  onClose,
  data,
}: {
  onClose: () => void;
  data: { header: string; video: Partial<VideoAttributes> } | null;
}) {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<{
    header: string;
    video: Partial<VideoAttributes>;
  } | null>(null);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setState(null);
    }, 200);
  };

  useEffect(() => {
    if (data) {
      setState(data);
      if (data.video.video_file_path) {
        if (typeof data.video.video_file_path === "string") {
          (async () => {
            try {
              const res = await getTemporaryVideoUrl(
                data.video.video_file_path
              );
              setUrl(res.data.url);
            } catch (e: any) {}
          })();
        } else setUrl(data.video.video_file_path[1]);
      }
    }
  }, [data]);

  return (
    <Dialog
      open={Boolean(data)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { bgcolor: "#f7f7f7", position: "relative" } }}
    >
      <IconButton
        onClick={handleClose}
        color="primary"
        size="large"
        disableRipple
        sx={{ position: "absolute", right: 0 }}
      >
        <Close fontSize="large" sx={{ color: "white" }} />
      </IconButton>
      <DialogTitle sx={{ px: 0, pt: 0 }}>
        <Typography variant="sectiontitle1">
          {state?.header}プレービュー
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
          <Typography variant="sectiontitle1" component="h3">
            {state?.video.title}
          </Typography>
          <Stack spacing={2} p={2}>
            <MUIRichTextEditor
              defaultValue={state?.video.content}
              toolbar={false}
              readOnly
            />
            <ReactPlayer url={url} controls width="100%" />
          </Stack>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}
