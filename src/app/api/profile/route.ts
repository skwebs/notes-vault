import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { userRepository } from "@/repositories/UserRepository";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await userRepository.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    void _passwordHash;
    return NextResponse.json({ success: true, message: "Profile retrieved", data: safeUser });
  } catch (error: unknown) {
    logger.error(error, "GET /api/profile error");
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, avatarUrl } = body;

    const user = await userRepository.update(session.user.id, { name, avatarUrl });
    const { passwordHash: _passwordHash, ...safeUser } = user;
    void _passwordHash;

    return NextResponse.json({ success: true, message: "Profile updated", data: safeUser });
  } catch (error: unknown) {
    logger.error(error, "PATCH /api/profile error");
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
