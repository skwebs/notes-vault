import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { noteService } from "@/services/NoteService";
import { updateNoteSchema } from "@/schemas/notes";
import { logger } from "@/lib/logger";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const note = await noteService.getNote(id, session.user.id);
    return NextResponse.json({ success: true, message: "Note retrieved", data: note });
  } catch (error: any) {
    const { id } = await params;
    logger.error(error, `GET /api/notes/${id} error`);
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateNoteSchema.parse(body);

    const note = await noteService.updateNote(id, session.user.id, validatedData);
    return NextResponse.json({ success: true, message: "Note updated", data: note });
  } catch (error: any) {
    const { id } = await params;
    logger.error(error, `PATCH /api/notes/${id} error`);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, message: "Validation failed", errors: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await noteService.deleteNote(id, session.user.id);
    return NextResponse.json({ success: true, message: "Note deleted" });
  } catch (error: any) {
    const { id } = await params;
    logger.error(error, `DELETE /api/notes/${id} error`);
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}
