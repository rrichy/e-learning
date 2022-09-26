import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import {
  DatePicker,
  // RadioGroup,
  Selection,
  TextField,
} from "../../molecules/LabeledHookForms";
import Trash from "@/assets/icon-trash.svg";
import { RadioGroup } from "@/components/atoms/HookForms";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import React, { useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  ChapterAttributes,
  chapterInit,
  CourseFormAttribute,
  QuestionAttributes,
  questionInit,
  TestAttributes,
  questionFormSchema,
} from "@/validations/CourseFormValidation";
import {
  FormContainer,
  FormContainerProps,
  useFieldArray,
  useForm,
  useFormContext,
  UseFormReturn,
} from "react-hook-form-mui";
import { Delete, DragIndicator, Quiz } from "@mui/icons-material";
import QuestionForm from "./QuestionForm";
import { yupResolver } from "@hookform/resolvers/yup";
import useConfirm from "@/hooks/useConfirm";
import {
  DragDropContext,
  Draggable,
  DraggableProvidedDragHandleProps,
  Droppable,
} from "react-beautiful-dnd";
import useAlerter from "@/hooks/useAlerter";

function TestForm({
  returnFn,
  type,
  testContext,
  handleTestSubmit,
}: {
  returnFn: () => void;
  type: "chapter" | "comprehension";
  testContext: UseFormReturn<TestAttributes, any>;
  handleTestSubmit: (
    e: React.BaseSyntheticEvent<TestAttributes, any, any>
  ) => void | Promise<void>;
}) {
  const { errorSnackbar } = useAlerter();
  const questionContext = useForm<QuestionAttributes>({
    mode: "onChange",
    defaultValues: questionInit,
    resolver: yupResolver(questionFormSchema),
  });
  const {
    formState: { isValid, isDirty },
    control,
  } = testContext;
  const { isConfirmed } = useConfirm();

  const {
    fields: questions,
    append,
    remove,
    move,
    update,
  } = useFieldArray({ control, name: "questions", keyName: "fieldKey" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const droppableId = useMemo(
    () => "droppable-questions-" + Number(new Date()),
    []
  );

  const handleQuestionSubmit = questionContext.handleSubmit(
    async (raw) => {
      const confirmed = await isConfirmed({
        title: "save question",
        content: "save question",
      });
      let current_order = 0;
      const parsed: QuestionAttributes = {
        ...raw,
        options: raw.options.map((option, optIndex) => ({
          ...option,
          correction_order:
            raw.format === 1
              ? option.correction_order !== null
                ? 1
                : null
              : raw.format === 2
              ? ((a) => a || null)(
                  raw.correct_indexes.findIndex(
                    (cindex) => cindex === optIndex
                  ) + 1
                )
              : option.correction_order !== null
              ? ++current_order
              : null,
        })),
      };

      if (parsed.options.every((a) => a.correction_order === null)) {
        errorSnackbar("Questions should have answers");
        return;
      }

      if (confirmed && openIndex !== null) {
        if (openIndex >= 0) update(openIndex, parsed);
        else append(parsed);
        setOpenIndex(null);
        setTimeout(() => questionContext.reset(questionInit), 200);
      }
    },
    (a, b) => console.log({ a, b })
  );

  return (
    <Paper variant="outlined">
      <FormContainer formContext={testContext} handleSubmit={handleTestSubmit}>
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">章末テストを作成</Typography>
          <Paper variant="sectionsubpaper">
            <Typography variant="sectiontitle3">基本情報</Typography>
            <Paper variant="outlined" sx={{ m: { xs: 2, md: 4 }, p: 2 }}>
              <Typography variant="sectiontitle2">章末テスト情報</Typography>
              <Stack spacing={2} p={2} alignItems="center">
                <Selection
                  name="passing_score"
                  label="合格ライン"
                  options={[25, 50, 75, 100].map((a) => ({ id: a, name: a }))}
                />
                <TextField name="title" label="章末テストタイトル" />
                <TextField
                  name="overview"
                  label="章末テスト内容"
                  multiline
                  rows={3}
                />
              </Stack>
            </Paper>
          </Paper>

          <Paper variant="sectionsubpaper">
            <Typography variant="sectiontitle3">問題</Typography>
            <DragDropContext
              onDragEnd={({ source, destination }) =>
                destination &&
                source.index !== destination.index &&
                move(source.index, destination.index)
              }
            >
              <Droppable droppableId={droppableId}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {questions.map(({ fieldKey, ...question }, index) => (
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
                            <QuestionCard
                              title={question.title}
                              points={+question.score!}
                              index={index}
                              removeFn={() => remove(index)}
                              editFn={() => {
                                // will be removed
                                const correct_indexes = question.options.reduce(
                                  (acc: number[], a, index) =>
                                    a.correction_order
                                      ? acc.concat(index)
                                      : acc,
                                  []
                                );
                                questionContext.reset({
                                  ...question,
                                  correct_indexes,
                                });
                                setOpenIndex(index);
                              }}
                              dragProps={provided.dragHandleProps!}
                              key={fieldKey}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Button
              variant="contained"
              type="button"
              onClick={() => setOpenIndex(-1)}
              // onClick={() => append(questionInit)}
              sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            >
              問題を追加✙
            </Button>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="center">
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
            <Button variant="contained" rounded large type="button">
              プレビュー
            </Button>
            <Button
              color="secondary"
              variant="contained"
              rounded
              large
              disabled={!(isDirty && isValid)}
            >
              章末テストを作成
            </Button>
          </Stack>
        </Stack>
      </FormContainer>

      <QuestionForm
        open={openIndex !== null}
        closeFn={() => {
          setOpenIndex(null);
          setTimeout(() => questionContext.reset(questionInit), 200);
        }}
        itemNumber={openIndex !== null ? (openIndex >= 0 ? openIndex : questions.length) + 1 : 0}
        formContext={questionContext}
        onSubmit={handleQuestionSubmit}
      />
    </Paper>
  );
  // return (
  //   <Stack justifyContent="space-between">
  //     <Container>
  //       <Stack spacing={3} sx={{ p: 3 }}>
  //         <FormContainer>
  //           <Paper variant="softoutline" sx={{ p: 6 }}>
  //             <Stack spacing={3}>
  //               <Typography
  //                 fontWeight="bold"
  //                 variant="h6"
  //                 pl={1}
  //                 sx={{ borderLeft: '5px solid #00c2b2' }}
  //               >
  //                 章末テストを作成
  //               </Typography>

  //               <Card>
  //                 <CardHeader
  //                   title="基本情報"
  //                   sx={{
  //                     fontWeight: "bold",
  //                     background: "#000000",
  //                     color: "#ffffff",
  //                     fontSize: "1.25rem"
  //                   }}
  //                 />
  //                 <CardContent>
  //                   <Stack spacing={2} p={2}>
  //                     <Selection
  //                       name="sex"
  //                       label="合格ライン"
  //                     />
  //                     <TextField
  //                       name="name"
  //                       label="章末テストタイトル"
  //                       placeholder="章末テストタイトルを入力"
  //                     />
  //                     <TextField
  //                       name="name"
  //                       label="章末テスト内容"
  //                       placeholder="章末テストの説明を入力"
  //                       multiline
  //                       rows={3}
  //                     />
  //                   </Stack>
  //                 </CardContent>
  //               </Card>

  //               <Card>
  //                 <CardHeader
  //                   title="問題 (Droppable)"
  //                   sx={{
  //                     fontWeight: "bold",
  //                     background: "#000000",
  //                     color: "#ffffff",
  //                     fontSize: "1.25rem"
  //                   }}
  //                 />
  //                 <CardContent>
  //                   <Stack p={2}>
  //                     <RadioGroup
  //                       name="gender"
  //                       row={false}
  //                       options={[
  //                         { id: 1, name: "全期間" },
  //                         { id: 2, name: "Date 1 and Date 2" },
  //                       ]}
  //                     />
  //                   </Stack>
  //                   <Stack direction="row" justifyContent="flex-end">
  //                     <Button
  //                       type="button"
  //                       variant="contained"
  //                       color="warning"
  //                       sx={{ height: 30, width: "fit-content", borderRadius: 6 }}
  //                       onClick={handleClickOpen}
  //                     >
  //                       問題を追加
  //                     </Button>
  //                   </Stack>
  //                 </CardContent>
  //               </Card>
  //             </Stack>

  //             <Stack direction="row" spacing={2} pt={5} justifyContent="center">
  //               <Button large color="inherit" variant="outlined" sx={{ borderRadius: 7 }}>キャンセル</Button>
  //               <Button large variant="contained" sx={{ borderRadius: 7 }}>プレビュー</Button>
  //               <Button large color="warning" variant="contained" sx={{ borderRadius: 7 }}>章末テストを作成</Button>
  //             </Stack>
  //           </Paper>

  //         </FormContainer>
  //       </Stack>
  //     </Container>
  //   </Stack>
  // );
}

export default TestForm;

const QuestionCard = ({
  title,
  index,
  removeFn,
  editFn,
  dragProps,
  points,
}: {
  title: string;
  index: number;
  points: number;
  removeFn: () => void;
  editFn: () => void;
  dragProps: DraggableProvidedDragHandleProps;
}) => (
  <Stack direction="row" m={{ xs: 2, md: 4 }} minHeight={110}>
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
            問{index + 1}
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
        <Stack spacing={2} width={1} ml={2}>
          <Typography fontWeight="bold">{title}</Typography>
          <Button
            variant="contained"
            startIcon={<Quiz />}
            rounded
            type="button"
            sx={{ maxWidth: "fit-content" }}
            onClick={editFn}
          >
            解説動画を編集
          </Button>
        </Stack>
        <Stack justifyContent="center">
          <Typography fontWeight="bold" fontSize={20} whiteSpace="nowrap">
            {points}配点
          </Typography>
        </Stack>
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
