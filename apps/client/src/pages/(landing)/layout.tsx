import { Outlet } from "react-router";

import Snowfall from "~/components/snowfall";

import Footer from "./footer";
import Navbar from "./navbar";

export default function LandingLayout() {
  return (
    <>
      <Snowfall color="#bddeec" count={100} />

      <Navbar />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
