import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", default: null, index: true },
  action: { type: String, required: true, trim: true, index: true },
  entity: { type: String, required: true, trim: true },
  entityId: { type: String, default: "" },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  ip: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
