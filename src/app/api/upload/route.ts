import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadService } from "@/services/UploadService";
import { noteService } from "@/services/NoteService";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const noteId = formData.get("noteId") as string;

    if (!file || !noteId) {
      return NextResponse.json({ success: false, message: "File and Note ID are required" }, { status: 400 });
    }

    // Check ownership of the note
    await noteService.getNote(noteId, session.user.id);

    const attachment = await uploadService.uploadFile(file, noteId);

    return NextResponse.json({ success: true, message: "File uploaded", data: attachment });
  } catch (error: unknown) {
    logger.error(error, "POST /api/upload error");
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
