import { UserAttributes } from "@/interfaces/AuthAttributes";
import { RegistrationFormAttribute } from "@/validations/RegistrationFormValidation";
import { get, post, BEARER_TOKEN, put } from "./ApiService";
import axios from "axios";
import { ChangePasswordFormAttribute } from "@/validations/ChangePasswordFormValidation";

export const getBearerToken = () => localStorage.getItem(BEARER_TOKEN) || "";

export const setBearerToken = (token: string) =>
  localStorage.setItem(BEARER_TOKEN, token);

export const deleteBearerToken = () => localStorage.removeItem(BEARER_TOKEN);

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  await get("/sanctum/csrf-cookie");
  const res = await post("/api/login", credentials);

  setBearerToken(res.data.access_token);
  return res;
};

export const getAuthData = () => {
  return get("/api/me");
};

export const updateAuthData = (payload: Partial<UserAttributes>) => {
  return put("/api/me", payload);
};

export const register = (payload: RegistrationFormAttribute) => {
  return post("/api/register", payload);
};

export const changePassword = (payload: ChangePasswordFormAttribute) => {
  return post("/api/me/change-password", payload);
};

export const logout = () => {
  return post("/api/logout");
};

export const upload = (
  type: "profile_image" | "course_image" | "chapter_video",
  params?: {
    uploadId?: string;
    partNumber?: number;
    filename?: string;
    parts?: { PartNumber: number; ETag: string }[];
    // parts?: string;
    contentType?: string;
  }
) => {
  let url = `/api/upload?type=${type}`;

  if (params?.uploadId) url += `&upload_id=${params.uploadId}`;
  if (params?.partNumber) url += `&part_number=${params.partNumber}`;
  if (params?.filename) url += `&filename=${params.filename}`;
  if (params?.parts && params.contentType) {
    return post(url, { parts: params.parts, contentType: params.contentType });
  }

  return get(url);
};

export const uploadImage = async (
  imageField: any,
  type: "profile_image" | "course_image" = "profile_image"
) => {
  if (!imageField) return null;
  if (typeof imageField === "string") return imageField;

  const url = await upload(type);
  await put(
    url.data,
    imageField[0],
    {
      headers: {
        "Content-Type": imageField[0].type,
      },
    },
    true
  );

  return url.data.split("?")[0] as string;
};

export const getTemporaryVideoUrl = (url: string) => {
  return get("/api/video?url=" + encodeURIComponent(url));
};

export const uploadVideo = async (
  videoField: any,
  callback?: (percent: number) => void
) => {
  if (!videoField) return null;
  if (typeof videoField === "string") {
    if (callback) callback(100);
    return videoField;
  }

  return new Promise(async (resolve: (v: string) => void, reject) => {
    // initiating a multipartupload
    const multipartUrl = await upload("chapter_video");
    const multipartRes = await axios.post(multipartUrl.data.url);
    const filename = multipartUrl.data.generated_key;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(multipartRes.data, "text/xml");
    const uploadId = xmlDoc.getElementsByTagName("UploadId")[0].childNodes[0]
      .nodeValue as string;

    const file = videoField[0] as File;
    const chunkSize = 10 * 1024 * 1024;
    const total = file.size;
    const reader = new FileReader();
    let loaded = 0;
    let partNumber = 0;
    let slice = file.slice(0, chunkSize);

    const collection: { PartNumber: number; ETag: string }[] = [];

    reader.readAsBinaryString(slice);

    reader.onload = async function (e) {
      console.log("uploaddddingg");

      // upload part
      const partUrl = await upload("chapter_video", {
        uploadId,
        partNumber: ++partNumber,
        filename,
      });
      const partRes = await axios.put(partUrl.data, slice);
      collection.push({ PartNumber: partNumber, ETag: partRes.headers.etag });

      loaded += chunkSize;
      if (callback) {
        const percentLoaded = Math.min((loaded / total) * 100, 100);
        callback(percentLoaded);
      }

      if (loaded <= total) {
        slice = file.slice(loaded, loaded + chunkSize);
        reader.readAsBinaryString(slice);
      } else {
        loaded = total;
        const parts = toXml(collection);

        // completemultipartupload
        const completeUrl = await upload("chapter_video", {
          uploadId,
          filename,
          parts: collection,
          contentType: file.type,
        });
        const completeRes = await axios.post(completeUrl.data, parts, {
          headers: { "Content-Type": file.type },
        });
        console.log("upload complete");
        resolve(multipartUrl.data.url.split("?")[0] as string);
      }
    };
  }).then(
    (v: string) => v,
    () => false
  );
};

const toXml = (data: { PartNumber: number; ETag: string }[]) => {
  return (
    "<CompleteMultipartUpload>" +
    data.reduce((result, el) => {
      return (
        result +
        `<Part><PartNumber>${el.PartNumber}</PartNumber><ETag>${el.ETag}</ETag></Part>\n`
      );
    }, "") +
    "</CompleteMultipartUpload>"
  );
};
