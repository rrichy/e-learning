import axios from "axios";

export default () => {
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.headers.common["Accept"] = "application/json";
};
