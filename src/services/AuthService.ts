import { userRepository } from "@/repositories/UserRepository";
import { RegisterInput, registerSchema } from "@/schemas/auth";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
    });

    logger.info({ userId: user.id }, "User registered successfully");
    return user;
  }
}

export const authService = new AuthService();
