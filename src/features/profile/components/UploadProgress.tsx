"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadProgressProps {
  progress: number;
  status?: string;
  className?: string;
}

export function UploadProgress({ progress, status = "Uploading avatar...", className }: UploadProgressProps) {
  return (
    <div 
      className={cn("flex flex-col gap-3 w-full p-4 animate-in fade-in zoom-in-95 duration-300", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label={status}
    >
      <div className="flex items-center justify-between text-sm font-medium">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>{status}</span>
        </div>
        <span className="text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-center text-muted-foreground">
        Please do not close this window.
      </p>
    </div>
  );
}
