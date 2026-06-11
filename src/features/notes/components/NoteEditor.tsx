"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema, NoteInput } from "@/schemas/notes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NoteWithRelations } from "@/repositories/NoteRepository";
import { useCreateNote, useUpdateNote, useTags } from "../api/useNotes";
import { toast } from "sonner";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NoteEditorProps {
  note?: NoteWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NoteEditor({ note, open, onOpenChange }: NoteEditorProps) {
  const queryClient = useQueryClient();
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote(note?.id || "");
  const { data: allTags } = useTags();
  
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      isArchived: false,
      tagIds: [],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const selectedTagIds = watch("tagIds") || [];

  // Reset form when note changes or when modal opens/closes
  useEffect(() => {
    if (open) {
      if (note) {
        reset({
          title: note.title,
          content: note.content || "",
          isArchived: note.isArchived,
          tagIds: note.tags?.map((t) => t.tagId) || [],
        });
      } else {
        reset({
          title: "",
          content: "",
          isArchived: false,
          tagIds: [],
        });
      }
      setFiles(null);
    }
  }, [note, reset, open]);

  const toggleTag = (tagId: string) => {
    const next = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];
    setValue("tagIds", next);
  };

  const onSubmit = async (data: NoteInput) => {
    try {
      let savedNote: NoteWithRelations;
      
      if (note) {
        savedNote = await updateMutation.mutateAsync(data) as NoteWithRelations;
        toast.success("Note updated");
      } else {
        savedNote = await createMutation.mutateAsync(data) as NoteWithRelations;
        toast.success("Note created");
      }

      if (files && files.length > 0) {
        setIsUploading(true);
        try {
          for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("noteId", savedNote.id);
            await axios.post("/api/upload", formData);
          }
          // Invalidate after uploads are done to ensure attachments appear
          await queryClient.invalidateQueries({ queryKey: ["notes"] });
          if (note) {
            await queryClient.invalidateQueries({ queryKey: ["notes", note.id] });
          }
        } finally {
          setIsUploading(false);
        }
      } else {
        // Even if no files, ensure we invalidate
        await queryClient.invalidateQueries({ queryKey: ["notes"] });
        if (note) {
          await queryClient.invalidateQueries({ queryKey: ["notes", note.id] });
        }
      }

      // Explicitly reset form and clear files state
      reset({
        title: "",
        content: "",
        isArchived: false,
        tagIds: [],
      });
      setFiles(null);
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong");
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{note ? "Edit Note" : "Create Note"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="Note title" />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Start typing..."
              className="min-h-[150px]"
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {allTags?.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer hover:opacity-80 transition-opacity",
                      !isSelected && "text-muted-foreground"
                    )}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                );
              })}
              {allTags?.length === 0 && (
                <p className="text-xs text-muted-foreground">No tags available.</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments (Images/PDFs)</Label>
            <Input 
              id="attachments" 
              type="file" 
              multiple 
              onChange={(e) => setFiles(e.target.files)} 
              className="cursor-pointer"
            />
            {files && files.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {files.length} file(s) selected
              </p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || isUploading}>
              {isUploading ? "Uploading..." : (note ? "Update Note" : "Create Note")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
