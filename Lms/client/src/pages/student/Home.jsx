import React from "react";

import Hero from "../../components/student/Hero";
import Companies from "../../components/student/Companies";
import CoursesSection from "../../components/student/CoursesSection";
import TestimonialSection from "../../components/student/TestimonialSection";
import CallToAction from "../../components/student/CallToAction";
import Footer from "../../components/student/Footer";


const Home = () => {
  return (
    <main
      className="
        min-h-screen
        w-full
        overflow-hidden
        bg-[#FAF9F6]
        text-[#171717]
      "
    >

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="w-full">
        <Hero />
      </section>


      {/* ================================================= */}
      {/* TRUST / COMPANIES */}
      {/* ================================================= */}

      <section
        className="
          w-full
          border-y
          border-[#E7E5E0]
          bg-white
        "
      >
        <Companies />
      </section>


      {/* ================================================= */}
      {/* COURSES */}
      {/* ================================================= */}

      <section
        className="
          w-full
          bg-[#FAF9F6]
        "
      >
        <CoursesSection />
      </section>


      {/* ================================================= */}
      {/* TESTIMONIALS */}
      {/* ================================================= */}

      <section
        className="
          w-full
          bg-white
        "
      >
        <TestimonialSection />
      </section>


      {/* ================================================= */}
      {/* CTA */}
      {/* ================================================= */}

      <section
        className="
          w-full
          bg-[#FAF9F6]
        "
      >
        <CallToAction />
      </section>


      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="w-full">
        <Footer />
      </footer>

    </main>
  );
};


export default Home;