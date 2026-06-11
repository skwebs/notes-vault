import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string(),
  isArchived: z.boolean(),
  tagIds: z.array(z.string()).optional(),
});

export const updateNoteSchema = noteSchema.partial();

export type NoteInput = z.infer<typeof noteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
