"use client";

import { useNotes } from "../api/useNotes";
import { NoteCard } from "./NoteCard";
import { NoteWithRelations } from "@/repositories/NoteRepository";
import { Skeleton } from "@/components/ui/skeleton";

interface NoteListProps {
  onEdit: (note: NoteWithRelations) => void;
  filter?: "all" | "archived" | "active";
  search?: string;
  tagId?: string;
}

export function NoteList({ onEdit, filter = "active", search, tagId }: NoteListProps) {
  const { data: notes, isLoading, error } = useNotes({ search, tagId });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error loading notes</p>;
  }

  const filteredNotes = notes?.filter((note) => {
    if (filter === "archived") return note.isArchived;
    if (filter === "active") return !note.isArchived;
    return true;
  });

  if (!filteredNotes || filteredNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">No notes found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredNotes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} />
      ))}
    </div>
  );
}
