import Snowfall from "~/components/snowfall";
import { Outlet } from "react-router";

import Footer from "./footer";
import Navbar from "./navbar";

export default function LandingLayout() {
  return (
    <>
        <Snowfall color="#2c3e50" count={100}/>
    
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
