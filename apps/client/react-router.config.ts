import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  prerender: ["/", "/about", "/contact"],
  ssr: true
} satisfies Config;
