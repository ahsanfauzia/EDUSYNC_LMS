import Course from "../models/course.js";
import User from "../models/User.js";
import Purchase from "../models/purchase.js";
import Enrollment from "../models/Enrollment.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";
import Coupon from "../models/Coupon.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const [users, educators, courses, purchases, revenue, enrollments] = await Promise.all([
      User.countDocuments(), User.countDocuments({ role: "educator" }), Course.countDocuments(), Purchase.countDocuments({ status: "completed" }),
      Purchase.aggregate([{ $match: { status: "completed" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Enrollment.countDocuments({ status: { $in: ["active", "completed"] } }),
    ]);
    return res.json({ success: true, dashboard: { users, educators, courses, purchases, enrollments, revenue: revenue[0]?.total || 0 } });
  } catch (error) {
    console.error("getAdminDashboard Error:", error);
    return res.status(500).json({ success: false, message: "Unable to load admin dashboard" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description = "", imageUrl = "" } = req.body;
    if (!name || !slug) return res.status(400).json({ success: false, message: "Name and slug are required" });
    const category = await Category.create({ name, slug, description, imageUrl });
    return res.status(201).json({ success: true, category });
  } catch (error) {
    return res.status(error?.code === 11000 ? 409 : 500).json({ success: false, message: error?.code === 11000 ? "Category already exists" : "Unable to create category" });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    return res.status(201).json({ success: true, coupon });
  } catch (error) {
    return res.status(error?.code === 11000 ? 409 : 400).json({ success: false, message: error.message || "Unable to create coupon" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "suspended", "deleted"].includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });
    const user = await User.findByIdAndUpdate(req.params.userId, { status }, { new: true }).select("_id name email role status");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to update user" });
  }
};

export const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.reviewId, { isApproved: Boolean(req.body.isApproved) }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    return res.json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to update review" });
  }
};
