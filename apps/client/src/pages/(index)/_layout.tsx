import { Outlet } from "react-router";

import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";

const Layout = () => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
