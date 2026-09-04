import express from "express";

import {
  getAllCourses,
  getCourseById,
} from "../controllers/courseController.js";

const courseRouter = express.Router();


// =====================================================
// PUBLIC COURSE ROUTES
// =====================================================

// Get all published courses
courseRouter.get(
  "/all",
  getAllCourses
);


// Get single course
courseRouter.get(
  "/:id",
  getCourseById
);


export default courseRouter;