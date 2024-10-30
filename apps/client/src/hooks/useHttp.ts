import { fetcher, httpError } from "@/lib";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";

export const useHTTP = <T>(
  url: string,
  config?: SWRConfiguration,
): SWRResponse<T> => {
  return useSWR<T>(url, fetcher, {
    onError: (error) => {
      httpError(error);
    },
    ...config,
  });
};
