import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/student/Navbar";

import Home from "./pages/student/Home";
import CoursesList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import Player from "./pages/student/Player";

import Educator from "./pages/educator/Educator";
import Dashboard from "./pages/educator/Dashboard";
import AddCourse from "./pages/educator/AddCourse";
import EditCourse from "./pages/educator/EditCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";

import Loading from "./components/student/Loading";

const App = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#171717]">

      <Routes>

        {/* =====================================================
            STUDENT ROUTES
        ===================================================== */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        <Route
          path="/course-list"
          element={
            <>
              <Navbar />
              <CoursesList />
            </>
          }
        />

        <Route
          path="/course-list/search/:input"
          element={
            <>
              <Navbar />
              <CoursesList />
            </>
          }
        />

        <Route
          path="/course/:id"
          element={
            <>
              <Navbar />
              <CourseDetails />
            </>
          }
        />

        <Route
          path="/my-enrollments"
          element={
            <>
              <Navbar />
              <MyEnrollments />
            </>
          }
        />

        <Route
          path="/player/:courseId"
          element={<Player />}
        />

        <Route
          path="/loading/:path"
          element={<Loading />}
        />


        {/* =====================================================
            EDUCATOR ROUTES
        ===================================================== */}

        <Route
          path="/educator"
          element={<Educator />}
        >
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="add-course"
            element={<AddCourse />}
          />

          <Route
            path="edit-course/:id"
            element={<EditCourse />}
          />

          <Route
            path="my-courses"
            element={<MyCourses />}
          />

          <Route
            path="student-enrolled"
            element={<StudentsEnrolled />}
          />
        </Route>


        {/* =====================================================
            FALLBACK
        ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>


      {/* =====================================================
          GLOBAL TOAST
      ===================================================== */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

    </div>
  );
};

export default App;