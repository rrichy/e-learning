import { InferType } from "yup";
import Yup from "./localizedYup";

const { string, number, date, mixed, array, object } = Yup;

export const questionFormSchema = object({
  id: number().nullable(),
  title: string().label("問題名").required(),
  statement: string().label("問題文").required(),
  format: number().label("問題形式").required().selectionId(true),
  score: number().label("配点").required(),
  explaination: string().label("説明").required(),
  options: array(
    object({
      id: number().nullable(),
      description: string().label("テキスト").required(),
      correction_order: number().nullable(),
    })
  ).min(1),
  // correct_indexes: mixed(),
  correct_indexes: array(number()),
});

export const testFormSchema = object({
  id: number().nullable(),
  passing_score: number().label("合格ライン").required().selectionId(),
  title: string().label("章末テストタイトル").required(),
  overview: string().label("章末テスト内容").required(),
  questions: array(questionFormSchema),
});

export const videoFormSchema = object({
  id: number().nullable(),
  title: string().label("解説動画タイトル").required(),
  content: string().label("解説動画内容").required(),
  video_file_path: string().label("動画ファイル").nullable(),
  // video_file_path: string().label("動画ファイル").required(),
});

export const videosFieldArraySchema = object({
  videos: array(videoFormSchema),
});

export const chapterFormSchema = object({
  id: number().nullable(),
  title: string().label("章のタイトル").required(),
  chapter_test: testFormSchema.nullable(),
  explainer_videos: array(videoFormSchema).nullable(),
});

export const courseFormSchema = object({
  status: number().label("公開設定").required().selectionId(),
  category_id: number().label("カテゴリ選択").required().selectionId(),
  image: mixed().label("コースアイコン").nullable(),
  title: string().label("コースタイトル").required(),
  content: string().label("コース内容").required(),
  study_time: number().label("標準学習時間").required(),
  priority: number().label("カテゴリ内の並び順").required(),
  is_whole_period: number().required(),
  start_period: string().when("is_whole_period", {
    is: (val: number | string) => val == 1,
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.required(),
  }),
  end_period: string().when("is_whole_period", {
    is: (val: number | string) => val == 1,
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.required(),
  }),
  target: number().required().selectionId(),
  chapters: array(chapterFormSchema),
});

export interface QuestionOptionAttributes {
  id: number | null;
  description: string;
  correction_order: number | null;
}

export interface QuestionAttributes {
  id: number | null;
  title: string;
  statement: string;
  format: number;
  score: string | null;
  explaination: string;
  options: QuestionOptionAttributes[];
  correct_indexes: number[];
}

export interface TestAttributes {
  chapter_title?: string;
  image?: string;
  questions_count?: number;
  questions_sum_score?: number;
  passing_score: number;
  title: string;
  overview: string;
  questions: QuestionAttributes[];
}

export interface VideoAttributes {
  title: string;
  content: string;
  video_file_path: string | File | null;
}

export interface ChapterAttributes {
  id: number | null;
  title: string;
  chapter_test: TestAttributes | null;
  explainer_videos: VideoAttributes[] | null;
}

export interface CourseFormAttribute
  extends Omit<
    InferType<typeof courseFormSchema>,
    | "study_time"
    | "priority"
    | "is_whole_period"
    | "start_period"
    | "end_period"
    | "chapters"
  > {
  study_time: string | null;
  priority: string | null;
  is_whole_period: boolean | null;
  start_period: Date | null;
  end_period: Date | null;
  chapters: ChapterAttributes[];
}

export type AttendingCourseAttribute = {
  progress_rate: number;
  status: number;
  start_date: string | null;
  completion_date: string | null;
};

export type CourseFormAttributeWithId = CourseFormAttribute & {
  id: number;
  attending_course?: AttendingCourseAttribute | null;
  chapters: (ChapterAttributes & { item_number: number })[];
};

export type CourseListAttribute = {
  id: number;
  name: string;
  start_period: Date;
  end_period: Date;
  courses: CourseFormAttributeWithId[];
};

export type SelectedChapterType = {
  index: number;
  screen: "chapter" | "explainer" | "comprehension";
} | null;

export const courseFormInit: CourseFormAttribute = {
  status: 0,
  category_id: 0,
  image: null,
  title: "",
  content: "",
  study_time: null,
  priority: null,
  is_whole_period: null,
  start_period: null,
  end_period: null,
  target: 0,
  chapters: [],
};

export const testInit: TestAttributes = {
  passing_score: 50,
  title: "",
  overview: "",
  questions: [],
};

export const questionInit: QuestionAttributes = {
  id: null,
  explaination: "",
  format: 0,
  score: "",
  statement: "",
  title: "",
  options: [],
  correct_indexes: [],
};

export const videoInit: VideoAttributes = {
  content: "",
  title: "",
  video_file_path: null,
};

export const chapterInit: ChapterAttributes = {
  id: null,
  title: "",
  chapter_test: null,
  explainer_videos: null,
};
