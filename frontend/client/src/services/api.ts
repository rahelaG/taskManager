import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // IMPORTANT pentru cookie-uri (session)
});
