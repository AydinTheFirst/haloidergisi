import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// Styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { type LoaderFunctionArgs, useLoaderData } from "react-router";

import type { Post } from "@/types";

import http from "@/http";
import { getFileUrl } from "@/utils";

// posts/view?postId=123
export const clientLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const postId = url.searchParams.get("postId");

  if (!postId) {
    throw new Error("Post ID is required");
  }

  const { data: post } = await http.get<Post>(`/posts/${postId}`);
  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

export default function Viewever() {
  const data = useLoaderData<typeof clientLoader>();

  const defaultLayoutPluginInstance = defaultLayoutPlugin({});

  return (
    <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'>
      <Viewer
        fileUrl={getFileUrl(data.file!)}
        plugins={[defaultLayoutPluginInstance]}
      />
    </Worker>
  );
}
