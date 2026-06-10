import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { noteService } from "@/services/NoteService";
import { logger } from "@/lib/logger";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const note = await noteService.restoreNote(id, session.user.id);
    return NextResponse.json({ success: true, message: "Note restored", data: note });
  } catch (error: any) {
    const { id } = await params;
    logger.error(error, `POST /api/notes/${id}/restore error`);
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}
