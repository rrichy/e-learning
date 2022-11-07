import { Box, Grid, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import { Selection, TextField } from "../../molecules/LabeledHookForms";
import { TextField as ATextField } from "@/components/atoms/HookForms";
import { ImageDropzone, RadioGroup } from "@/components/atoms/HookForms";
import { OptionAttribute } from "@/interfaces/CommonInterface";
import ConditionalDateRange from "@/components/atoms/HookForms/ConditionalDateRange";
import {
  Delete,
  DragIndicator,
  EventNote,
  VideoLibrary,
} from "@mui/icons-material";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import {
  chapterInit,
  CourseFormAttribute,
  SelectedChapterType,
  TestAttributes,
  VideoAttributes,
} from "@/validations/CourseFormValidation";
import {
  DragDropContext,
  Draggable,
  DraggableProvidedDragHandleProps,
  Droppable,
} from "@hello-pangea/dnd";
import { useMemo } from "react";

function CourseManagementForm({
  categories,
  control,
  setSelection,
  simulateFn,
}: {
  categories: OptionAttribute[];
  control: Control<CourseFormAttribute>;
  setSelection: (d: SelectedChapterType) => void;
  simulateFn: () => void;
}) {
  const {
    formState: { isValid, isDirty },
  } = useFormContext();
  const {
    fields: chapters,
    append: appendChapter,
    remove: removeChapter,
    move: moveChapter,
  } = useFieldArray({ name: "chapters", control, keyName: "fieldKey" });
  const droppableId = useMemo(
    () => "droppable-chapters-" + Number(new Date()),
    []
  );

  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <Typography variant="sectiontitle2">コースを作成</Typography>
        <Paper variant="sectionsubpaper">
          <Typography variant="sectiontitle3">基本情報</Typography>
          <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
            <Typography variant="sectiontitle2">コース情報</Typography>
            <Stack spacing={2} p={2} alignItems="center">
              <Selection
                name="status"
                label="公開設定"
                options={[
                  { id: 0, name: "未選択", selectionType: "disabled" },
                  { id: 1, name: "非公開" },
                  { id: 2, name: "公開" },
                ]}
              />
              <Selection
                name="category_id"
                label="カテゴリ選択"
                options={categories}
              />
              <TextField
                name="title"
                label="コースタイトル"
                placeholder="コースタイトルを入力"
              />
              <TextField
                name="content"
                label="コース内容"
                placeholder="コースの説明を入力"
                multiline
                rows={3}
              />
              <TextField
                name="study_time"
                label="標準学習時間"
                value={0}
                type="number"
                inputProps={{ min: 0 }}
                suffix="分"
              />
              <TextField
                name="priority"
                label="カテゴリ内の並び順"
                type="number"
                inputProps={{ min: 0 }}
              />
              <ImageDropzone
                name="image"
                placeholder="text"
                sx={{ minWidth: 300, minHeight: 300, maxWidth: 400 }}
              />
            </Stack>
            <Typography variant="sectiontitle2">受講期間</Typography>
            <Box p={2}>
              <ConditionalDateRange
                radioName="is_whole_period"
                radioLabel="全期間"
                radioValue={1}
                dateRangeValue={0}
                DateRangeProps={{
                  minDateProps: { name: "start_period" },
                  maxDateProps: { name: "end_period" },
                }}
              />
            </Box>
            <Typography variant="sectiontitle2">受講対象</Typography>
            <Box p={2}>
              <RadioGroup
                name="target"
                row={false}
                options={[
                  { id: 1, name: "全員" },
                  { id: 2, name: "グループ" },
                  { id: 3, name: "個別" },
                ]}
              />
            </Box>
          </Paper>
        </Paper>

        <Paper variant="sectionsubpaper">
          <Typography variant="sectiontitle3">章を作成</Typography>
          <DragDropContext
            onDragEnd={({ source, destination }) =>
              destination &&
              source.index !== destination.index &&
              moveChapter(source.index, destination.index)
            }
          >
            <Droppable droppableId={droppableId}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {chapters.map(
                    ({ explainer_videos, chapter_test, fieldKey }, index) => (
                      <Draggable
                        key={index}
                        draggableId={fieldKey + index}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <Chapter
                              key={fieldKey}
                              removeFn={() => removeChapter(index)}
                              explainFn={() =>
                                setSelection({ index, screen: "explainer" })
                              }
                              chapterFn={() =>
                                setSelection({ index, screen: "chapter" })
                              }
                              index={index}
                              videosMeta={explainer_videos}
                              testMeta={chapter_test}
                              dragProps={provided.dragHandleProps!}
                            />
                          </div>
                        )}
                      </Draggable>
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button
            variant="contained"
            type="button"
            onClick={() => appendChapter(chapterInit)}
            sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          >
            章を追加✙
          </Button>
        </Paper>

        {/* INSERT COMPREHENSION TEST HERE */}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            color="dull"
            variant="outlined"
            rounded
            large
            type="button"
            to="/course-management"
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            rounded
            large
            type="button"
            onClick={simulateFn}
          >
            プレビュー
          </Button>
          <Button
            color="secondary"
            variant="contained"
            rounded
            large
            type="submit"
            disabled={!(isValid && isDirty)}
          >
            コースを作成
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default CourseManagementForm;

const Chapter = ({
  index,
  removeFn,
  explainFn,
  chapterFn,
  videosMeta,
  testMeta,
  dragProps,
}: {
  index: number;
  removeFn: () => void;
  explainFn: () => void;
  chapterFn: () => void;
  videosMeta?: VideoAttributes[] | null;
  testMeta?: TestAttributes | null;
  dragProps: DraggableProvidedDragHandleProps;
}) => {
  return (
    <Stack direction="row" m={{ xs: 2, md: 4 }}>
      <Paper
        variant="outlined"
        sx={{
          p: "16px !important",
          flex: 1,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Stack direction="row" width={1}>
          <Stack>
            <Typography fontWeight="bold" fontSize={20} whiteSpace="nowrap">
              {index + 1}章
            </Typography>
            <Stack
              flex={1}
              {...dragProps}
              alignItems="center"
              justifyContent="center"
            >
              <DragIndicator />
            </Stack>
          </Stack>
          <Grid container spacing={2} width={1} ml={1}>
            <Grid item xs={12}>
              <ATextField
                name={`chapters.${index}.title`}
                placeholder="章のタイトルを入力してください"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                startIcon={<VideoLibrary />}
                rounded
                type="button"
                onClick={explainFn}
              >
                解説動画を編集
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {videosMeta?.map(({ title }, index) => (
                <Typography key={index}>{`${index + 1} - ${title}`}</Typography>
              )) || <Typography>No videos posted</Typography>}
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                startIcon={<EventNote />}
                rounded
                onClick={chapterFn}
                type="button"
              >
                章末テストを編集
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {testMeta?.questions?.map(({ title }, index) => (
                <Typography key={index}>{`${index + 1} - ${title}`}</Typography>
              )) || <Typography>No questions posted</Typography>}
            </Grid>
          </Grid>
        </Stack>
      </Paper>
      <Button
        type="button"
        color="secondary"
        startIcon={<Delete />}
        onClick={removeFn}
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
        削除
      </Button>
    </Stack>
  );
};
