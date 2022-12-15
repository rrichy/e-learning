import { uploadVideo } from "@/services/AuthService";
import { ChapterAttributes } from "@/validations/CourseFormValidation";

type ProgressManager = React.Dispatch<
  React.SetStateAction<{
    progress: number[][];
    status: "uploading" | "complete";
    chapters: ChapterAttributes[];
  } | null>
>;

export default async function parseChapters(
  raw: ChapterAttributes[],
  progressMan: ProgressManager
) {
  progressMan({
    progress: raw.map(
      ({ explainer_videos }) => explainer_videos?.map(() => 0) ?? []
    ),
    status: "uploading",
    chapters: raw,
  });

  const parsed = await Promise.all(
    raw.map(async ({ explainer_videos, ...chapter }, chapterIndex) => {
      const parsedVideos = await Promise.all(
        explainer_videos?.map(async ({ video_file_path, ...video }, index) => {
          const uploaded_video = await uploadVideo(
            video_file_path,
            (percent) => {
              progressMan((s) => {
                const temp = [...s!.progress];
                let status: "uploading" | "complete" = "uploading";
                temp[chapterIndex][index] = percent;

                if (
                  chapterIndex === raw.length - 1 &&
                  index === explainer_videos.length - 1 &&
                  percent === 100
                )
                  status = "complete";

                return {
                  chapters: s!.chapters,
                  progress: temp,
                  status,
                };
              });
            }
          );

          return {
            ...video,
            video_file_path: uploaded_video,
          };
        }) || []
      );

      return {
        ...chapter,
        explainer_videos: parsedVideos,
      } as ChapterAttributes;
    })
  );

  progressMan((p) =>
    p
      ? {
          ...p,
          status: "complete",
        }
      : null
  );

  return parsed;
}
