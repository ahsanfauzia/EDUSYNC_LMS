import express from "express";

import {
  addCourse,
  getEducatorCourses,
  updateRoleToEducator,
  updateCourse,

  addChapter,
  updateChapter,
  deleteChapter,

  addLecture,
  updateLecture,
  deleteLecture,

  uploadLectureNotes,
  deleteLectureNotes,

  educatorDashboardData,
  getEnrolledStudentsData,
} from "../controllers/educatorController.js";

import upload from "../configs/multer.js";

import {
  protectUser,
  protectEducator,
} from "../middlewares/authMiddleware.js";


const educatorRouter = express.Router();


/*
=====================================================
EDUCATOR ROLE
=====================================================
*/

// Become educator
educatorRouter.get(
  "/update-role",
  protectUser,
  updateRoleToEducator
);


/*
=====================================================
COURSES
=====================================================
*/

// Add new course
educatorRouter.post(
  "/add-course",
  protectEducator,
  upload.single("image"),
  addCourse
);


// Get educator's courses
educatorRouter.get(
  "/courses",
  protectEducator,
  getEducatorCourses
);


// Update course
educatorRouter.put(
  "/course/:id",
  protectEducator,
  upload.single("image"),
  updateCourse
);


/*
=====================================================
CHAPTERS
=====================================================
*/

// Add chapter
educatorRouter.post(
  "/course/:courseId/chapter",
  protectEducator,
  addChapter
);


// Update chapter
educatorRouter.put(
  "/course/:courseId/chapter/:chapterId",
  protectEducator,
  updateChapter
);


// Delete chapter
educatorRouter.delete(
  "/course/:courseId/chapter/:chapterId",
  protectEducator,
  deleteChapter
);


/*
=====================================================
LECTURES
=====================================================
*/

// Add lecture
educatorRouter.post(
  "/course/:courseId/chapter/:chapterId/lecture",
  protectEducator,
  addLecture
);


// Update lecture
educatorRouter.put(
  "/course/:courseId/chapter/:chapterId/lecture/:lectureId",
  protectEducator,
  updateLecture
);


// Delete lecture
educatorRouter.delete(
  "/course/:courseId/chapter/:chapterId/lecture/:lectureId",
  protectEducator,
  deleteLecture
);


/*
=====================================================
LECTURE NOTES / PDF
=====================================================
*/

// Upload PDF notes
educatorRouter.post(
  "/course/:courseId/chapter/:chapterId/lecture/:lectureId/notes",
  protectEducator,
  upload.single("notes"),
  uploadLectureNotes
);


// Delete PDF notes
educatorRouter.delete(
  "/course/:courseId/chapter/:chapterId/lecture/:lectureId/notes",
  protectEducator,
  deleteLectureNotes
);


/*
=====================================================
DASHBOARD
=====================================================
*/

// Dashboard data
educatorRouter.get(
  "/dashboard",
  protectEducator,
  educatorDashboardData
);


// Enrolled students
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);


export default educatorRouter;