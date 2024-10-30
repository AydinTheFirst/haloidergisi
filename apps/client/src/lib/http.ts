import axios from "axios";
import { toast } from "sonner";

const API = import.meta.env.PROD ? "/api" : "http://localhost:3000/api";

export const http = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || "token"}`,
  },
});

export const fetcher = (url: string) => http.get(url).then((res) => res.data);

export const asyncRedirect = async (url: string) => {
  toast.success("Success! Redirecting...", {
    description: `You will be redirected to ${url} in 3 seconds.`,
  });

  setTimeout(() => {
    window.location.href = url;
  }, 3000);
};

export const httpError = (error: any) => {
  if (error.response.status === 401) {
    location.href = "/login";
    localStorage.removeItem("token");
  }

  if (error.response.status === 403) {
    location.href = "/settings";
  }

  let errorMessage = "Something went wrong!";
  let errorDescription = error.message;

  if (error.response) {
    const { message, errors } = error.response.data;
    if (message) errorMessage = message;
    if (errors) errorDescription = zodError(errors);
  } else if (error.request) {
    errorMessage = error.request;
  } else {
    errorMessage = error.message;
  }

  toast.error(errorMessage, {
    description: errorDescription,
    descriptionClassName: "whitespace-pre-wrap",
  });
};

const zodError = (error: any) => {
  const json = error.map((err: any) => {
    return `Field: ${err.path.join(".")} | Error: ${err.message}`;
  });

  return json.join("\n");
};
