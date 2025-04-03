import { type RouteConfig } from "@react-router/dev/routes";
import { nextRoutes } from "rr-next-routes";

const routes = nextRoutes({
  extensions: [".tsx", ".ts", ".jsx", ".js"],
  folderName: "pages",
  layoutFileName: "_layout",
  print: "info",
  routeFileNameOnly: false,
  routeFileNames: ["index"]
});

export default routes satisfies RouteConfig;
