import { eventHandler } from "h3";

export default eventHandler(async (event) => {
  const apiUrl = process.env.VITE_API_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${apiUrl}/sitemap/xml`);
    const sitemap = await response.text();

    event.node.res.setHeader("Content-Type", "application/xml");
    event.node.res.setHeader("Cache-Control", "public, max-age=3600");

    return sitemap;
  } catch (error) {
    console.error("Error fetching sitemap:", error);
    event.node.res.statusCode = 500;
    return "Error generating sitemap";
  }
});
