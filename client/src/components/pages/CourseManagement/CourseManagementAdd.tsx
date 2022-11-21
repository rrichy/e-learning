import { FormContainer } from "react-hook-form-mui";
import useAlerter from "@/hooks/useAlerter";
import { useNavigate } from "react-router-dom";
import { storeCourse } from "@/services/CourseService";
import { CourseFormAttribute } from "@/validations/CourseFormValidation";
import { getCacheableOptions } from "@/services/CommonService";
import CourseManagementForm from "@/components/organisms/CourseManagementFragments/CourseManagementForm";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import TestForm from "@/components/organisms/CourseManagementFragments/TestForm";
import useConfirm from "@/hooks/useConfirm";
import ExplainerVideoForm from "@/components/organisms/CourseManagementFragments/ExplainerVideoForm";
import Preview from "./Preview";
import { uploadImage } from "@/services/AuthService";
import UploadStatus from "./UploadStatus";
import parseChapters from "@/utils/parseChapters";
import useCourseFormHelper from "@/hooks/pages/useCourseFormHelper";

function CourseManagementAdd() {
  const navigate = useNavigate();
  const { successSnackbar, handleError } = useAlerter();
  const { isConfirmed } = useConfirm();
  const { options } = getCacheableOptions("categories");

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
            const res = await storeCourse({ ...raw, image, chapters });

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
        value={courseContext.formState.isSubmitting}
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

export default CourseManagementAdd;
