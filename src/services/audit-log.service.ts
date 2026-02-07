import mongoose from "mongoose";
import AuditLogModel from "../models/audit-log.model";

export const logActivity = async (
    workspaceId: string | mongoose.Types.ObjectId,
    actorId: string | mongoose.Types.ObjectId,
    action: string,
    entityId?: string | mongoose.Types.ObjectId,
    entityType?: string
) => {
    try {
        // Fire and forget - don't await this in the main controller flow to avoid latency
        // In a real production app, this might go to a queue (BeeQueue/BullMQ)
        await AuditLogModel.create({
            workspaceId,
            actorId,
            action,
            entityId,
            entityType,
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
        // Silent fail to not disrupt main user flow
    }
};

export const getWorkspaceLogsService = async (workspaceId: string) => {
    const logs = await AuditLogModel.find({ workspaceId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("actorId", "name email profilePicture")
        .lean();

    return { logs };
};
