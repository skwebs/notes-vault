import { db } from "@/db";
import { notes, noteTags } from "@/db/schema";
import { eq, and, desc, ilike, or, exists, SQL } from "drizzle-orm";
import { NoteInput, UpdateNoteInput } from "@/schemas/notes";
import { tagRepository } from "./TagRepository";

export interface NoteFilters {
  search?: string;
  tagId?: string;
}

export type Note = typeof notes.$inferSelect;

export class NoteRepository {
  async findAllByUserId(userId: string, filters: NoteFilters = {}) {
    const { search, tagId } = filters;

    const conditions: SQL[] = [eq(notes.userId, userId)];

    if (search) {
      conditions.push(
        or(
          ilike(notes.title, `%${search}%`),
          ilike(notes.content, `%${search}%`)
        )!
      );
    }

    if (tagId) {
      conditions.push(
        exists(
          db
            .select()
            .from(noteTags)
            .where(
              and(
                eq(noteTags.noteId, notes.id),
                eq(noteTags.tagId, tagId)
              )
            )
        )
      );
    }

    return await db.query.notes.findMany({
      where: and(...conditions),
      orderBy: [desc(notes.updatedAt)],
      with: {
        attachments: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });
  }

  async findById(id: string, userId: string) {
    return await db.query.notes.findFirst({
      where: and(eq(notes.id, id), eq(notes.userId, userId)),
      with: {
        attachments: true,
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });
  }

  async create(userId: string, data: NoteInput) {
    const { tagIds, ...noteData } = data;
    const [note] = await db
      .insert(notes)
      .values({
        ...noteData,
        userId,
      })
      .returning();

    if (tagIds && tagIds.length > 0) {
      await tagRepository.associateWithNote(note.id, tagIds);
    }

    return await this.findById(note.id, userId);
  }

  async update(id: string, userId: string, data: UpdateNoteInput) {
    const { tagIds, ...noteData } = data;
    
    if (Object.keys(noteData).length > 0) {
      await db
        .update(notes)
        .set({
          ...noteData,
          updatedAt: new Date(),
        })
        .where(and(eq(notes.id, id), eq(notes.userId, userId)));
    }

    if (tagIds !== undefined) {
      await tagRepository.associateWithNote(id, tagIds);
    }

    return await this.findById(id, userId);
  }

  async delete(id: string, userId: string) {
    const [note] = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();
    return note;
  }
}

export const noteRepository = new NoteRepository();
export type NoteWithRelations = NonNullable<Awaited<ReturnType<NoteRepository["findById"]>>>;
