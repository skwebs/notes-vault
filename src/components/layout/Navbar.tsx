"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Search, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/features/profile/api/useProfile";

export function Navbar() {
  const { data: profile } = useProfile();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          Notes<span className="text-primary">Vault</span>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name || "User"} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
