import { users } from "@/db/schema";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}
