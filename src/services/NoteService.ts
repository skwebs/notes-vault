import { noteRepository, NoteFilters } from "@/repositories/NoteRepository";
import { NoteInput, UpdateNoteInput } from "@/schemas/notes";
import { uploadService } from "./UploadService";
import { logger } from "@/lib/logger";

export class NoteService {
  async getNotes(userId: string, filters: NoteFilters = {}) {
    return await noteRepository.findAllByUserId(userId, filters);
  }

  async getNote(id: string, userId: string) {
    const note = await noteRepository.findById(id, userId);
    if (!note) {
      throw new Error("Note not found");
    }
    return note;
  }

  async createNote(userId: string, data: NoteInput) {
    return await noteRepository.create(userId, data);
  }

  async updateNote(id: string, userId: string, data: UpdateNoteInput) {
    return await noteRepository.update(id, userId, data);
  }

  async deleteNote(id: string, userId: string) {
    const note = await noteRepository.findById(id, userId);
    if (!note) {
      throw new Error("Note not found");
    }

    logger.info({ noteId: id, attachmentsCount: note.attachments?.length || 0 }, "Starting note deletion");

    // Delete attachments from Cloudinary
    if (note.attachments && note.attachments.length > 0) {
      for (const attachment of note.attachments) {
        if (attachment.publicId) {
          const resourceType = attachment.fileType?.split("/")[0] || "image";
          logger.debug({ attachmentId: attachment.id, publicId: attachment.publicId, resourceType }, "Processing attachment deletion");
          await uploadService.deleteFile(attachment.publicId, resourceType);
        }
      }
    }

    const deletedNote = await noteRepository.delete(id, userId);
    logger.info({ noteId: id }, "Note deleted from database");
    return deletedNote;
  }

  async archiveNote(id: string, userId: string) {
    return await noteRepository.update(id, userId, { isArchived: true });
  }

  async restoreNote(id: string, userId: string) {
    return await noteRepository.update(id, userId, { isArchived: false });
  }
}

export const noteService = new NoteService();
