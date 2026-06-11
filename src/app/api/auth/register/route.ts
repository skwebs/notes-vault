import { NextResponse } from "next/server";
import { registerSchema } from "@/schemas/auth";
import { authService } from "@/services/AuthService";
import { ApiResponse } from "@/types";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const user = await authService.register(validatedData);

    const response: ApiResponse = {
      success: true,
      message: "User registered successfully",
      data: { id: user.id, name: user.name, email: user.email },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    logger.error(error, "Registration error");
    
    if (error && typeof error === 'object' && 'name' in error && error.name === "ZodError") {
      const zodError = error as import("zod").ZodError;
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: zodError.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
