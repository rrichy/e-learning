import { FormContainer, useForm } from "react-hook-form-mui";
import { useEffect, useRef, useState } from "react";
import useAlerter from "@/hooks/useAlerter";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  showCourse,
  storeCourse,
  updateCourse,
} from "@/services/CourseService";
import {
  ChapterAttributes,
  CourseFormAttribute,
  CourseFormAttributeWithId,
  courseFormInit,
  courseFormSchema,
  SelectedChapterType,
  TestAttributes,
  testFormSchema,
  testInit,
  VideoAttributes,
  videoFormSchema,
  videoInit,
  videosFieldArraySchema,
} from "@/validations/CourseFormValidation";
import { getOptions } from "@/services/CommonService";
import { OptionAttribute } from "@/interfaces/CommonInterface";
import CourseManagementForm from "@/components/organisms/CourseManagementFragment/CourseManagementForm";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import TestForm from "@/components/organisms/CourseManagementFragment/TestForm";
import useConfirm from "@/hooks/useConfirm";
import ExplainerVideoForm from "@/components/organisms/CourseManagementFragment/ExplainerVideoForm";

function CourseManagementAddEdit() {
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const { courseId } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [categories, setCategories] = useState<OptionAttribute[]>([
    { id: 0, name: "未選択", selectionType: "disabled" },
  ]);
  const { successSnackbar, errorSnackbar, handleError } = useAlerter();
  const { isConfirmed } = useConfirm();
  const [selectedChapter, setSelectedChapter] =
    useState<SelectedChapterType>(null);
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

  const isCreate =
    pathname
      .split("/")
      .filter((a) => a)
      .pop() === "create";

  const handleSubmit = courseContext.handleSubmit(
    async (raw: CourseFormAttribute) => {
      const confirmed = await isConfirmed({
        title: "confirm course",
        content: "confirm course",
      });

      if (confirmed) {
        try {
          const res = await (isCreate
            ? storeCourse(raw)
            : updateCourse(+courseId!, raw));

          successSnackbar(res.data.message);
          navigate("/course-management");
        } catch (e: any) {
          const errors = handleError(e);
          type Key = keyof CourseFormAttribute;
          Object.entries(errors).forEach(([name, error]) => {
            const err = error as string | string[];
            const str_error = typeof err === "string" ? err : err.join("");
            courseContext.setError(name as Key, {
              type: "manual",
              message: str_error,
            });
          });
        }
      }
    },
    (a, b) => console.log({ a, b, data: courseContext.getValues() })
  );

  const handleTestSubmit = testContext.handleSubmit(async (raw) => {
    const confirmed = await isConfirmed({
      title: "save test",
      content: "save test",
    });

    if (confirmed) {
      if (
        raw.passing_score > raw.questions.reduce((acc, b) => acc + (+b.score!), 0)
      ) {
        testContext.setError("passing_score", {
          type: "value",
          message: "Reduce the passing_score or add more questions",
        });
      } else {
        if (selectedChapter?.screen && selectedChapter.screen === "chapter") {
          courseContext.setValue(
            `chapters.${selectedChapter.index}.${selectedChapter.screen}_test`,
            raw,
            { shouldDirty: true }
          );
        }
        setSelectedChapter(null);
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
        if (selectedChapter?.screen === "explainer") {
          courseContext.setValue(
            `chapters.${selectedChapter.index}.explainer_videos`,
            raw.videos,
            { shouldDirty: true }
          );
        }
        setSelectedChapter(null);
        console.log(raw);
      }
    },
    (a, b) => console.log({ a, b, data: courseContext.getValues() })
  );

  useEffect(() => {
    if (selectedChapter?.screen === "explainer") {
      videoContext.reset({
        videos: courseContext.getValues(
          `chapters.${selectedChapter.index}.explainer_videos`
        ) || [videoInit],
      });
    }
    if (selectedChapter?.screen && selectedChapter.screen === "chapter") {
      testContext.reset(
        courseContext.getValues(
          `chapters.${selectedChapter.index}.${selectedChapter.screen}_test`
        ) || testInit
      );
    }
  }, [selectedChapter?.screen, selectedChapter?.index]);

  useEffect(() => {
    mounted.current = true;

    (async () => {
      try {
        let shouldFetch = false;
        let course: CourseFormAttribute | CourseFormAttributeWithId =
          courseFormInit;
        const promise = [getOptions(["categories"])];

        if (!isCreate) {
          if (!state) {
            shouldFetch = true;
            promise.push(showCourse(+courseId!));
          } else course = state as CourseFormAttributeWithId;
        }
        const res = await Promise.all(promise);

        setCategories([
          { id: 0, name: "未選択", selectionType: "disabled" },
          ...res[0].data.categories,
        ]);
        if (!isCreate)
          courseContext.reset(!shouldFetch ? course : res[1].data.data);
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setInitialized(true);
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, [state, pathname, courseId, isCreate]);

  return (
    <DisabledComponentContextProvider
      showLoading
      value={courseContext.formState.isSubmitting || !initialized}
    >
      <FormContainer formContext={courseContext} handleSubmit={handleSubmit}>
        {!selectedChapter && (
          <CourseManagementForm
            categories={categories}
            control={courseContext.control}
            setSelection={setSelectedChapter}
          />
        )}
      </FormContainer>
      {selectedChapter && selectedChapter?.screen !== "explainer" && (
        <TestForm
          testContext={testContext}
          handleTestSubmit={handleTestSubmit}
          returnFn={() => setSelectedChapter(null)}
          type={selectedChapter.screen}
        />
      )}
      <FormContainer
        formContext={videoContext}
        handleSubmit={handleVideoSubmit}
      >
        {selectedChapter?.screen === "explainer" && (
          <ExplainerVideoForm
            returnFn={() => setSelectedChapter(null)}
            control={videoContext.control}
            chapterIndex={selectedChapter.index}
          />
        )}
      </FormContainer>
    </DisabledComponentContextProvider>
  );
}

export default CourseManagementAddEdit;
