import { Webhook } from "svix";
import Stripe from "stripe";

import connectDB from "../configs/mongodb.js";

import User from "../models/User.js";
import Course from "../models/course.js";
import Purchase from "../models/purchase.js";
import Enrollment from "../models/Enrollment.js";
import Notification from "../models/Notification.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

/* ========================= CLERK WEBHOOK ========================= */

export const clerkWebhooks = async (req, res) => {
  try {
    await connectDB();

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : JSON.stringify(req.body);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const event = wh.verify(payload, headers);

    const { data, type } = event;

    switch (type) {
      case "user.created":
        await User.create({
          _id: data.id,
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          email: data.email_addresses[0].email_address,
          imageUrl: data.image_url,
        });
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, {
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          email: data.email_addresses[0].email_address,
          imageUrl: data.image_url,
        });
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;

      default:
        console.log("Unhandled Clerk Event:", type);
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Clerk Webhook Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ========================= STRIPE WEBHOOK ========================= */

export const stripeWebhooks = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      endpointSecret
    );
  } catch (error) {
    console.error("Stripe Webhook Error:", error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    await connectDB();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const purchaseId = session.metadata.purchaseId;

        const purchase = await Purchase.findById(purchaseId);

        if (!purchase) {
          return res.status(404).json({
            success: false,
            message: "Purchase Not Found",
          });
        }

        if (purchase.status !== "completed") {
          purchase.status = "completed";
          purchase.stripeSessionId = session.id;
          purchase.stripePaymentIntentId = session.payment_intent || "";
          purchase.paymentId = session.payment_intent || session.id;
          await purchase.save();

          await Enrollment.findOneAndUpdate(
            { userId: purchase.userId, courseId: purchase.courseId },
            { $setOnInsert: { userId: purchase.userId, courseId: purchase.courseId, purchaseId: purchase._id, status: "active" } },
            { upsert: true, new: true }
          );

          await User.findByIdAndUpdate(purchase.userId, { $addToSet: { enrolledCourses: purchase.courseId } });
          await Course.findByIdAndUpdate(purchase.courseId, { $addToSet: { enrolledStudents: purchase.userId }, $inc: { enrollmentCount: 1 } });
          await Notification.create({ userId: purchase.userId, title: "Payment successful", message: "Your course purchase is complete. You can now start learning.", type: "payment" });
        }

        console.log("Payment Successful");
        break;
      }

      case "payment_intent.succeeded":
        console.log("Payment Intent Succeeded");
        break;

      default:
        console.log(`Unhandled Stripe Event: ${event.type}`);
    }

    return res.json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe Webhook Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};