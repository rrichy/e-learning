import { get, put } from "./ApiService";

const url_prefix = "/api/chapter";

export const getLectures = (chapterId: number) => {
  return get(`${url_prefix}/${chapterId}/lecture`);
};

export const updateViewingInformation = (
  videoId: number,
  playback_position: number,
  is_complete: boolean = false
) => {
  return put(`/api/video/${videoId}/update`, {
    playback_position,
    is_complete,
  });
};
