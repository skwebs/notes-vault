"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useProfile, useUpdateProfile } from "@/features/profile/api/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ name });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/40">
        <Navbar />
        <main className="container px-4 py-8 mx-auto">
          <Skeleton className="h-64 w-full max-w-md mx-auto" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <main className="container px-4 py-8 mx-auto">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your account details.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile?.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  defaultValue={profile?.name || ""} 
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
