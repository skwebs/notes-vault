"use client";

import React, { useRef, useState, useEffect } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RotateCw, RotateCcw, ZoomIn, ZoomOut, Maximize, Loader2 } from "lucide-react";
import { useUpdateAvatar } from "../api/useProfile";
import { UploadProgress } from "./UploadProgress";
import { toast } from "sonner";

interface ImageCropperProps {
  image: string;
  onSuccess: (avatarUrl: string) => void;
  onCancel: () => void;
  open: boolean;
}

export function ImageCropper({ image, onSuccess, onCancel, open }: ImageCropperProps) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const updateAvatar = useUpdateAvatar();

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleCrop = async () => {
    if (isUploading) return;

    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas({
      width: 400,
      height: 400,
    }).toBlob(async (blob) => {
      if (!blob) {
        toast.error("Failed to process image");
        return;
      }

      try {
        setIsUploading(true);
        cropperRef.current?.cropper.disable();
        setProgress(0);
        
        abortControllerRef.current = new AbortController();

        const data = await updateAvatar.mutateAsync({
          file: blob,
          onProgress: (p) => setProgress(p),
          signal: abortControllerRef.current.signal,
        });

        if (data?.avatarUrl) {
          toast.success("Avatar updated successfully");
          onSuccess(data.avatarUrl);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error: any) {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          return;
        }
        toast.error(error?.response?.data?.message || "Failed to upload avatar");
        setIsUploading(false);
        cropperRef.current?.cropper.enable();
      } finally {
        if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
          setIsUploading(false);
        }
      }
    }, "image/jpeg", 0.9);
  };

  const rotate = (degree: number) => {
    if (isUploading) return;
    cropperRef.current?.cropper.rotate(degree);
  };

  const zoom = (ratio: number) => {
    if (isUploading) return;
    cropperRef.current?.cropper.zoom(ratio);
  };

  const reset = () => {
    if (isUploading) return;
    cropperRef.current?.cropper.reset();
  };

  const handleOpenChange = (val: boolean) => {
    if (!val && !isUploading) {
      onCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden" showCloseButton={!isUploading}>
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Crop Avatar</DialogTitle>
        </DialogHeader>
        
        <div 
          className="relative aspect-square w-full bg-muted flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC')",
            backgroundRepeat: "repeat"
          }}
        >
          <Cropper
            src={image}
            style={{ height: "100%", width: "100%" }}
            initialAspectRatio={1}
            aspectRatio={1}
            guides={true}
            ref={cropperRef}
            viewMode={1}
            dragMode={isUploading ? "none" : "move"}
            autoCropArea={1}
            background={true}
            responsive={true}
            checkOrientation={false}
            disabled={isUploading}
            ready={() => {
              if (isUploading) {
                cropperRef.current?.cropper.disable();
              }
            }}
          />
          
          {isUploading && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
              <UploadProgress progress={progress} className="max-w-xs bg-background rounded-lg shadow-lg border" />
            </div>
          )}
        </div>

        {!isUploading && (
          <div className="flex items-center justify-center gap-2 p-4 bg-background">
            <Button variant="outline" size="icon" onClick={() => rotate(-90)}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => rotate(90)}>
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => zoom(0.1)}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => zoom(-0.1)}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={reset}>
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        )}

        <DialogFooter className="p-4 pt-0 bg-background flex flex-row justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleCrop} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Crop & Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
