import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/file", // update if your backend is elsewhere
  withCredentials: true,
});

export default api;
