import { Outlet } from "react-router";

import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";

const Layout = () => {
  return (
    <div className='flex min-h-screen flex-col gap-10'>
      <Navbar />
      <main className='container flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
