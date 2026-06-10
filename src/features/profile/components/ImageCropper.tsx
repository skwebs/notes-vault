"use client";

import React, { useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RotateCw, RotateCcw, ZoomIn, ZoomOut, Maximize } from "lucide-react";

interface ImageCropperProps {
  image: string;
  onCrop: (blob: Blob) => void;
  onCancel: () => void;
  open: boolean;
}

export function ImageCropper({ image, onCrop, onCancel, open }: ImageCropperProps) {
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas({
        width: 400,
        height: 400,
      }).toBlob((blob) => {
        if (blob) {
          onCrop(blob);
        }
      }, "image/jpeg", 0.9);
    }
  };

  const rotate = (degree: number) => {
    cropperRef.current?.cropper.rotate(degree);
  };

  const zoom = (ratio: number) => {
    cropperRef.current?.cropper.zoom(ratio);
  };

  const reset = () => {
    cropperRef.current?.cropper.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onCancel()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-black">
        <DialogHeader className="p-4 text-white">
          <DialogTitle>Crop Avatar</DialogTitle>
        </DialogHeader>
        
        <div className="relative aspect-square w-full bg-black flex items-center justify-center">
          <Cropper
            src={image}
            style={{ height: "100%", width: "100%" }}
            initialAspectRatio={1}
            aspectRatio={1}
            guides={true}
            ref={cropperRef}
            viewMode={1}
            dragMode="move"
            autoCropArea={1}
            background={false}
            responsive={true}
            checkOrientation={false}
          />
        </div>

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

        <DialogFooter className="p-4 pt-0 bg-background">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleCrop}>Crop & Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
