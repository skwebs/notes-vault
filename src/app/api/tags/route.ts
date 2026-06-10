import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { tagService } from "@/services/TagService";
import { tagSchema } from "@/schemas/tags";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const tags = await tagService.getTags();
    return NextResponse.json({ success: true, message: "Tags retrieved", data: tags });
  } catch (error: any) {
    logger.error(error, "GET /api/tags error");
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
    const validatedData = tagSchema.parse(body);

    const tag = await tagService.createTag(validatedData);
    return NextResponse.json({ success: true, message: "Tag created", data: tag }, { status: 201 });
  } catch (error: any) {
    logger.error(error, "POST /api/tags error");
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, message: "Validation failed", errors: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
