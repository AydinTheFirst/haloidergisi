import { Outlet } from "react-router-dom";

import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="container px-3 py-16 md:px-10">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
