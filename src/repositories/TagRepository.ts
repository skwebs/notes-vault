import { db } from "@/db";
import { tags, noteTags } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { TagInput } from "@/schemas/tags";

export type Tag = typeof tags.$inferSelect;

export class TagRepository {
  async findAll() {
    return await db.query.tags.findMany({
      orderBy: [tags.name],
    });
  }

  async findByName(name: string) {
    return await db.query.tags.findFirst({
      where: eq(tags.name, name),
    });
  }

  async create(data: TagInput) {
    const [tag] = await db.insert(tags).values(data).returning();
    return tag;
  }

  async findOrCreateMany(names: string[]) {
    if (names.length === 0) return [];

    const existingTags = await db.query.tags.findMany({
      where: inArray(tags.name, names),
    });

    const existingNames = existingTags.map((t) => t.name);
    const newNames = names.filter((name) => !existingNames.includes(name));

    const newTags = newNames.length > 0 
      ? await db.insert(tags).values(newNames.map(name => ({ name }))).returning()
      : [];

    return [...existingTags, ...newTags];
  }

  async associateWithNote(noteId: string, tagIds: string[]) {
    // Remove old associations
    await db.delete(noteTags).where(eq(noteTags.noteId, noteId));

    if (tagIds.length > 0) {
      await db.insert(noteTags).values(
        tagIds.map((tagId) => ({ noteId, tagId }))
      );
    }
  }
}

export const tagRepository = new TagRepository();
