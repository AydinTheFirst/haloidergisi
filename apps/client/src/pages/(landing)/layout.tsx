import { Outlet } from "react-router";

import Footer from "./footer";
import Navbar from "./navbar";

export default function LandingLayout() {
  return (
    <>
      <Navbar />
      <div className='flex min-h-screen flex-col'>
        <main className='flex-1'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
