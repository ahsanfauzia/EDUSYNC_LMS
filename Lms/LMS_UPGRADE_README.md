# LMS backend upgrade

This version upgrades the existing MongoDB/Mongoose LMS without forcing an immediate rewrite of the existing course-content structure. Existing `Course.courseContent`, `User.enrolledCourses`, and `Course.enrolledStudents` fields are kept for frontend compatibility while normalized collections are added for new logic.

## Added collections

- `Enrollment` - source of truth for active/completed/cancelled/expired enrollment.
- `Review` - one review per user/course, with aggregate rating fields on Course for fast reads.
- `Category` - reusable course categories.
- `EducatorProfile` - educator profile and social information.
- `Coupon` - percentage/fixed discount rules.
- `Wishlist` - unique user/course wishlist entries.
- `Notification` - user notifications.
- `Announcement` - educator course announcements.
- `Certificate` - issued certificates and public verification.
- `AuditLog` - admin/important action history.
- `Question` - quiz question foundation.
- `LectureProgress` - per-lecture watch/resume state.

## Important payment change

Paid `/api/user/purchase` requests now create a Stripe Checkout Session and return `checkoutUrl`. Enrollment is granted only after the signed Stripe webhook receives `checkout.session.completed`. Free courses can still be enrolled directly.

## Existing data migration

1. Configure the real values in `server/.env`.
2. Start MongoDB connectivity.
3. Run `cd server && npm run migrate`.
4. Verify `Enrollment` and `Review` counts in MongoDB.
5. Only then remove legacy enrollment arrays after the frontend is fully migrated.

The migration is intentionally non-destructive. It copies legacy enrollment/rating data into normalized collections.

## Required environment variables

Use `server/.env.example` and `client/.env.example`. The distributed `.env` files contain placeholders only. Any real secrets that were present in the original project archive should be rotated before production use.

For Stripe Checkout redirects, set `CLIENT_URL` to the deployed frontend URL. Configure the Stripe webhook endpoint to `/stripe`. Configure the Clerk webhook endpoint to `/clerk`.

## What still needs product-level implementation

The backend data foundation is now present, but UI screens are still needed for admin management, coupons, notifications, certificates, announcements, quizzes, and educator profile editing. These are intentionally not fabricated into the existing UI because that would require a separate UX implementation.
