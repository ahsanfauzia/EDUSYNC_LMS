import express from "express";
import { protectUser } from "../middlewares/authMiddleware.js";
import {
  addUserRatings,
  getUserData,
  userEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
} from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.use(protectUser);
userRouter.get("/data", getUserData);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);
userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.post("/get-course-progress", getUserCourseProgress);
userRouter.post("/add-rating", addUserRatings);

export default userRouter;
