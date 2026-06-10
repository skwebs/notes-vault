import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadService } from "@/services/UploadService";
import { userRepository } from "@/repositories/UserRepository";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "File is required" }, { status: 400 });
    }

    const { secure_url } = await uploadService.uploadAvatar(file);

    // Update user's avatarUrl
    await userRepository.update(session.user.id, { avatarUrl: secure_url });

    return NextResponse.json({ success: true, message: "Avatar updated", data: { avatarUrl: secure_url } });
  } catch (error: any) {
    logger.error(error, "POST /api/profile/avatar error");
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}
