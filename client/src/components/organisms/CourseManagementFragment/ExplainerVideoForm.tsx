import { Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import {
  Control,
  Controller,
  useFieldArray,
  useFormContext,
} from "react-hook-form-mui";
import { TextField } from "../../molecules/LabeledHookForms";
import { useState } from "react";
import MUIRichTextEditor from "mui-rte";
import ReactPlayer from "react-player";
import { VideoAttributes, videoInit } from "@/validations/CourseFormValidation";
import { Delete, Save } from "@mui/icons-material";
import { convertToRaw } from "draft-js";

function ExplainerVideoForm({
  returnFn,
  control,
  chapterIndex,
}: {
  returnFn: () => void;
  control: Control<{ videos: VideoAttributes[] }>;
  chapterIndex: number;
}) {
  const {
    formState: { isValid, isDirty },
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

        {fields.map(({ fieldKey }, index) => (
          <Paper variant="sectionsubpaper" key={fieldKey}>
            <Typography variant="sectiontitle3">{`${chapterIndex + 1}-${
              index + 1
            } 解説動画`}</Typography>
            <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
              <Typography variant="sectiontitle2">解説動画タ情報</Typography>
              <Stack spacing={2} p={2} alignItems="center">
                <TextField
                  name={`videos.${index}.title`}
                  label="解説動画タイトル"
                />
                <Controller
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
                />
                <Controller
                  name={`videos.${index}.video_file_path`}
                  render={({ field: { value } }) =>
                    value ? (
                      <ReactPlayer
                        url={value}
                        // url={value ?? "https://www.dailymotion.com/video/x83gqeu"}
                        played={0}
                        loaded={0}
                        pip={false}
                        muted={false}
                        duration={0}
                        loop={false}
                        controls
                      />
                    ) : (
                      <div>dropzone here</div>
                    )
                  }
                />
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
    </Paper>
  );
}

export default ExplainerVideoForm;
