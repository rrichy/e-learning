import { FormContainer } from "react-hook-form-mui";
import useAlerter from "@/hooks/useAlerter";
import { useNavigate, useParams } from "react-router-dom";
import { showCourse, updateCourse } from "@/services/CourseService";
import { CourseFormAttribute } from "@/validations/CourseFormValidation";
import { useCacheableOptions } from "@/services/CommonService";
import CourseManagementForm from "@/components/organisms/CourseManagementFragments/CourseManagementForm";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import TestForm from "@/components/organisms/CourseManagementFragments/TestForm";
import useConfirm from "@/hooks/useConfirm";
import ExplainerVideoForm from "@/components/organisms/CourseManagementFragments/ExplainerVideoForm";
import Preview from "./Preview";
import { uploadImage } from "@/services/AuthService";
import UploadStatus from "./UploadStatus";
import parseChapters from "@/utils/parseChapters";
import { useQuery } from "@tanstack/react-query";
import useCourseFormHelper from "@/hooks/pages/useCourseFormHelper";

function CourseManagementEdit() {
  const navigate = useNavigate();
  const { successSnackbar, errorSnackbar, handleError } = useAlerter();
  const { isConfirmed } = useConfirm();
  const { options } = useCacheableOptions("categories");
  const { courseId: id } = useParams();
  const courseId = +id!;

  const {
    courseContext,
    videoContext,
    testContext,
    handleVideoSubmit,
    handleTestSubmit,
    videoUploadState,
    setVideoUploadState,
    selectedChapter,
    setSelectedChapter,
    displayPreview,
    setDisplayPreview,
    screen,
    setScreen,
  } = useCourseFormHelper();

  const { isFetching } = useQuery(
    ["course-details", courseId],
    () => showCourse(courseId),
    {
      refetchOnWindowFocus: false,
      onSuccess: (res: any) => courseContext.reset(res.data.data),
      onError: (e: any) => errorSnackbar(e.message),
    }
  );

  const handleSubmit = courseContext.handleSubmit(
    async (raw: CourseFormAttribute) => {
      const confirmed = await isConfirmed({
        title: "confirm course",
        content: "confirm course",
      });

      if (confirmed) {
        try {
          const image = await uploadImage(raw.image, "course_image");
          const chapters = await parseChapters(
            raw.chapters,
            setVideoUploadState
          );

          if (chapters) {
            const res = await updateCourse(courseId, {
              ...raw,
              image,
              chapters,
            });

            successSnackbar(res.data.message);
            navigate("/course-management");
          }
        } catch (e: any) {
          handleError(e, courseContext);
        }
      }
    },
    (a, b) => console.log({ a, b, data: courseContext.getValues() })
  );

  return (
    <>
      <DisabledComponentContextProvider
        showLoading
        value={courseContext.formState.isSubmitting || isFetching}
      >
        <FormContainer formContext={courseContext} handleSubmit={handleSubmit}>
          {!selectedChapter && (
            <CourseManagementForm
              categories={[
                { id: 0, name: "未選択", selectionType: "disabled" },
                ...(options?.categories ?? []),
              ]}
              control={courseContext.control}
              setSelection={setSelectedChapter}
              simulateFn={() => {
                setDisplayPreview(courseContext.getValues());
                setScreen("course");
              }}
            />
          )}
        </FormContainer>
        {selectedChapter && selectedChapter?.screen !== "explainer" && (
          <TestForm
            testContext={testContext}
            handleTestSubmit={handleTestSubmit}
            returnFn={() => setSelectedChapter(null)}
            type={selectedChapter.screen}
            simulateFn={() => {
              const course = courseContext.getValues();
              course.chapters[selectedChapter.index].chapter_test =
                testContext.getValues();

              setDisplayPreview(course);
              setScreen(`chapter/${selectedChapter.index}/chapter-test`);
            }}
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
      <Preview
        course={displayPreview}
        onClose={() => setDisplayPreview(null)}
        toScreen={screen}
      />
      <UploadStatus
        state={videoUploadState}
        onClose={() => setVideoUploadState(null)}
      />
    </>
  );
}

export default CourseManagementEdit;
