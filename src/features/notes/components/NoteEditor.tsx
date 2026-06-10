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
import { NoteWithRelations, Note } from "@/repositories/NoteRepository";
import { useCreateNote, useUpdateNote } from "../api/useNotes";
import { toast } from "sonner";
import axios from "axios";

interface NoteEditorProps {
  note?: NoteWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NoteEditor({ note, open, onOpenChange }: NoteEditorProps) {
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote(note?.id || "");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      isArchived: false,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        content: note.content || "",
        isArchived: note.isArchived,
      });
    } else {
      reset({
        title: "",
        content: "",
        isArchived: false,
      });
    }
  }, [note, reset]);

  const onSubmit = async (data: NoteInput) => {
    try {
      let savedNote: Note;
      if (note) {
        savedNote = await updateMutation.mutateAsync(data) as Note;
        toast.success("Note updated");
      } else {
        savedNote = await createMutation.mutateAsync(data) as Note;
        toast.success("Note created");
      }

      if (files && files.length > 0) {
        setIsUploading(true);
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("noteId", savedNote.id);
          await axios.post("/api/upload", formData);
        }
        setIsUploading(false);
      }

      onOpenChange(false);
    } catch {
      toast.error("Something went wrong");
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
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
              className="min-h-[200px]"
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
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
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || isUploading}>
              {isUploading ? "Uploading..." : (note ? "Update Note" : "Create Note")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
