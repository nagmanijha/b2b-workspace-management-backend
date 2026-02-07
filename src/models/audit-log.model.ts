import mongoose, { Document, Schema } from "mongoose";

export interface AuditLogDocument extends Document {
  workspaceId: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId;
  action: string;
  entityId?: mongoose.Types.ObjectId;
  entityType?: string; // "Project", "Task", "Member", "Workspace"
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    entityType: {
      type: String,
      required: false,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // Only createdAt is really needed, but timestamps gives both
  }
);

// TTL Index: Automatically delete logs older than 30 days
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const AuditLogModel = mongoose.model<AuditLogDocument>(
  "AuditLog",
  auditLogSchema
);

export default AuditLogModel;
