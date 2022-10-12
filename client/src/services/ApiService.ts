import axios, { Axios, AxiosRequestConfig } from "axios";
import { getBearerToken } from "./AuthService";

export const BEARER_TOKEN = "bearer_token";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Accept": "application/json",
  },
  withCredentials: true,
});

export const post = async (url: string, data: any = {}) => {
  try {
    let access_token = localStorage.getItem(BEARER_TOKEN);
    let headers: any = {};
    if (access_token) {
      headers["Authorization"] = `Bearer ${access_token}`;
    }

    let response = await axiosInstance({
      method: "POST",
      url: url,
      headers: headers,
      data,
    });

    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const get = (url: string, data?: any) => {
  return axiosInstance({
    method: "GET",
    url: url,
    headers: {
      Authorization: `Bearer ${getBearerToken()}`,
    },
    params: data,
  });
};

export const destroy = async (url: string, data?: any) => {
  try {
    let access_token = localStorage.getItem(BEARER_TOKEN);
    let headers: any = {};

    if (access_token) {
      headers["Authorization"] = "Bearer " + access_token;
    }

    let response = await axiosInstance({
      method: "DELETE",
      url: url,
      headers: headers,
      data: data,
    });

    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const patch = async (url: string, data: any = {}) => {
  try {
    let access_token = localStorage.getItem(BEARER_TOKEN);
    let headers: any = {};
    if (access_token) {
      headers["Authorization"] = `Bearer ${access_token}`;
    }

    let response = await axiosInstance({
      method: "PATCH",
      url: url,
      headers: headers,
      data: data,
    });

    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const put = async (url: string, data: any, config: AxiosRequestConfig = {}, detachAuth = false) => {
  try {
    let access_token = localStorage.getItem(BEARER_TOKEN);
    let headers: AxiosRequestConfig["headers"] = config.headers ?? {};
    if (access_token && !detachAuth) {
      headers["Authorization"] = `Bearer ${access_token}`;
    }

    let response = await axiosInstance({
      method: "PUT",
      url: url,
      headers: headers,
      data: data,
    });

    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getPublicImage = (imageName: string) => {
  return `${BASE_URL}images/${imageName}`;
};

export const getPublicVideo = (pathName: string) =>
  `${BASE_URL}videos/${pathName}`;
