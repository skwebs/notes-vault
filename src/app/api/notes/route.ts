import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { noteService } from "@/services/NoteService";
import { noteSchema } from "@/schemas/notes";
import { logger } from "@/lib/logger";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const tagId = searchParams.get("tagId") || undefined;

    const notes = await noteService.getNotes(session.user.id, { search, tagId });
    return NextResponse.json({ success: true, message: "Notes retrieved", data: notes });
  } catch (error: any) {
    logger.error(error, "GET /api/notes error");
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = noteSchema.parse(body);

    const note = await noteService.createNote(session.user.id, validatedData);
    return NextResponse.json({ success: true, message: "Note created", data: note }, { status: 201 });
  } catch (error: any) {
    logger.error(error, "POST /api/notes error");
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, message: "Validation failed", errors: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
