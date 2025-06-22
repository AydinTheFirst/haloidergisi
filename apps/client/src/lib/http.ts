import { API_URL } from "~/config";
import axios from "axios";
import { toast } from "sonner";

const http = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

http.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => err
);

const fetcher = (url: string) => http.get(url).then((res) => res.data);

const handleError = (error: unknown) => {
  console.error("Hata:", error);

  if (!axios.isAxiosError(error)) {
    return toast.error("Beklenmeyen bir hata oluştu.");
  }

  if (!error.response) {
    return toast.error("Ağ bağlantısı hatası!", {
      description: "Lütfen internet bağlantınızı kontrol edin."
    });
  }

  const { errors, message } = error.response.data as {
    errors?: string[];
    message: string;
  };

  console.error("API Hatası:", message, errors);

  return toast.error(message, {
    description: errors && errors.join("\n")
  });
};

const uploadFiles = async (files: File[]) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await http.post<string[]>("/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
};

export { fetcher, handleError, http, uploadFiles };
