import { db } from "@/db";
import { attachments } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;

export class AttachmentRepository {
  async findByNoteId(noteId: string) {
    return await db.query.attachments.findMany({
      where: eq(attachments.noteId, noteId),
    });
  }

  async create(data: NewAttachment) {
    const [attachment] = await db.insert(attachments).values(data).returning();
    return attachment;
  }

  async delete(id: string) {
    const [attachment] = await db
      .delete(attachments)
      .where(eq(attachments.id, id))
      .returning();
    return attachment;
  }
}

export const attachmentRepository = new AttachmentRepository();
