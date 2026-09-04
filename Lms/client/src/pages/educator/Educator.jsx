import React from "react";
import { Outlet } from "react-router-dom";

import EducatorNavbar from "../../components/educator/Navbar";
import EducatorSidebar from "../../components/educator/Sidebar";
import EducatorFooter from "../../components/educator/Footer";

const Educator = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#171717]">

      {/* ===================================================== */}
      {/* EDUCATOR APPLICATION SHELL */}
      {/* ===================================================== */}

      <div className="flex min-h-screen">

        {/* =================================================== */}
        {/* SIDEBAR */}
        {/* =================================================== */}

        <aside className="relative z-30 shrink-0">
          <EducatorSidebar />
        </aside>


        {/* =================================================== */}
        {/* RIGHT CONTENT */}
        {/* =================================================== */}

        <div className="flex min-w-0 flex-1 flex-col">

          {/* Top Navbar */}

          <header className="sticky top-0 z-20">
            <EducatorNavbar />
          </header>


          {/* Page Content */}

          <main
            className="
              min-h-[calc(100vh-80px)]
              flex-1
              overflow-x-hidden
              bg-[#FAF9F6]
              p-4
              sm:p-6
              lg:p-8
              xl:p-10
            "
          >
            <div className="mx-auto w-full max-w-[1500px]">
              <Outlet />
            </div>
          </main>


          {/* Footer */}

          <footer className="border-t border-[#E7E5E0] bg-white">
            <EducatorFooter />
          </footer>

        </div>

      </div>

    </div>
  );
};

export default Educator;