"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useProfile, useUpdateProfile, useUpdateAvatar } from "@/features/profile/api/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, User as UserIcon } from "lucide-react";
import { ImageCropper } from "@/features/profile/components/ImageCropper";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const updateAvatar = useUpdateAvatar();
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ name: name || profile?.name });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = async (blob: Blob) => {
    try {
      await updateAvatar.mutateAsync(blob);
      toast.success("Avatar updated");
      setSelectedImage(null);
    } catch {
      toast.error("Failed to upload avatar");
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
          <CardHeader className="text-center">
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary bg-muted flex items-center justify-center">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name || "Avatar"} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                disabled={updateAvatar.isPending}
              >
                <Camera className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
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
                  placeholder="Your name"
                />
              </div>
            </CardContent>
            <CardFooter className="mt-6">
              <Button type="submit" className="w-full" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>

      {selectedImage && (
        <ImageCropper
          image={selectedImage}
          open={!!selectedImage}
          onCancel={() => setSelectedImage(null)}
          onCrop={handleCrop}
        />
      )}
    </div>
  );
}
