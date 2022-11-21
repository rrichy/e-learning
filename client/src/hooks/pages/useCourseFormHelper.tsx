import { CourseScreenType } from "@/interfaces/CommonInterface";
import {
  ChapterAttributes,
  CourseFormAttribute,
  courseFormInit,
  courseFormSchema,
  SelectedChapterType,
  TestAttributes,
  testFormSchema,
  testInit,
  VideoAttributes,
  videoInit,
  videosFieldArraySchema,
} from "@/validations/CourseFormValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAlerter from "../useAlerter";
import useConfirm from "../useConfirm";

function useCourseFormHelper() {
  const { errorSnackbar } = useAlerter();
  const { isConfirmed } = useConfirm();
  const [selCh, setSelCh] = useState<SelectedChapterType>(null);
  const [disPrev, setDisPrev] = useState<CourseFormAttribute | null>(null);
  const [screen, setScreen] = useState<CourseScreenType>("course");
  const [videoUploadState, setVideoUploadState] = useState<{
    progress: number[][];
    status: "uploading" | "complete";
    chapters: ChapterAttributes[];
  } | null>(null);

  const courseContext = useForm<CourseFormAttribute>({
    mode: "onChange",
    defaultValues: courseFormInit,
    resolver: yupResolver(courseFormSchema),
  });

  const testContext = useForm<TestAttributes>({
    mode: "onChange",
    defaultValues: testInit,
    resolver: yupResolver(testFormSchema),
  });

  const videoContext = useForm<{ videos: VideoAttributes[] }>({
    mode: "onChange",
    defaultValues: { videos: [] },
    resolver: yupResolver(videosFieldArraySchema),
  });

  const handleTestSubmit = testContext.handleSubmit(async (raw) => {
    const confirmed = await isConfirmed({
      title: "save test",
      content: "save test",
    });

    if (confirmed) {
      if (
        raw.passing_score > raw.questions.reduce((acc, b) => acc + +b.score!, 0)
      ) {
        testContext.setError("passing_score", {
          type: "value",
          message: "Reduce the passing_score or add more questions",
        });
        errorSnackbar("Reduce the passing_score or add more questions");
      } else {
        if (selCh?.screen && selCh.screen === "chapter") {
          courseContext.setValue(
            `chapters.${selCh.index}.${selCh.screen}_test`,
            raw,
            { shouldDirty: true }
          );
        }
        setSelCh(null);
        console.log(raw);
      }
    }
  });

  const handleVideoSubmit = videoContext.handleSubmit(
    async (raw) => {
      const confirmed = await isConfirmed({
        title: "save video",
        content: "save video",
      });

      if (confirmed) {
        if (selCh?.screen === "explainer") {
          courseContext.setValue(
            `chapters.${selCh.index}.explainer_videos`,
            raw.videos,
            { shouldDirty: true }
          );
        }
        setSelCh(null);
        console.log(raw);
      }
    },
    (a, b) => console.log({ a, b, data: courseContext.getValues() })
  );

  useEffect(() => {
    if (selCh?.screen === "explainer") {
      videoContext.reset({
        videos: courseContext.getValues(
          `chapters.${selCh.index}.explainer_videos`
        ) || [videoInit],
      });
    }
    if (selCh?.screen && selCh.screen === "chapter") {
      testContext.reset(
        courseContext.getValues(
          `chapters.${selCh.index}.${selCh.screen}_test`
        ) || testInit
      );
    }
  }, [selCh?.screen, selCh?.index]);

  return {
    courseContext,
    videoContext,
    testContext,
    handleVideoSubmit,
    handleTestSubmit,
    videoUploadState,
    setVideoUploadState,
    selectedChapter: selCh,
    setSelectedChapter: setSelCh,
    displayPreview: disPrev,
    setDisplayPreview: setDisPrev,
    screen,
    setScreen,
  };
}

export default useCourseFormHelper;
