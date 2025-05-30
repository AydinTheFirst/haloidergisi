declare module "axios" {
  export interface AxiosInstance {
    fetcher: <T>(url: string) => Promise<T>;
    handleError: (error: unknown) => void;
    uploadFiles: (files: File[]) => Promise<string[]>;
  }
}

export {};
