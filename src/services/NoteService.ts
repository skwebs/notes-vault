import { noteRepository, NoteFilters } from "@/repositories/NoteRepository";
import { NoteInput, UpdateNoteInput } from "@/schemas/notes";

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
    return await noteRepository.delete(id, userId);
  }

  async archiveNote(id: string, userId: string) {
    return await noteRepository.update(id, userId, { isArchived: true });
  }

  async restoreNote(id: string, userId: string) {
    return await noteRepository.update(id, userId, { isArchived: false });
  }
}

export const noteService = new NoteService();
