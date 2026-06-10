"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { NoteList } from "@/features/notes/components/NoteList";
import { NoteEditor } from "@/features/notes/components/NoteEditor";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { NoteWithRelations } from "@/repositories/NoteRepository";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteWithRelations | null>(null);
  const [filter, setFilter] = useState<"active" | "archived" | "all">("active");
  const [search, setSearch] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>();

  const handleEdit = (note: NoteWithRelations) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <main className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
            <p className="text-muted-foreground">Manage and organize your personal notes.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-8 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-8 w-full md:max-w-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <Button
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={filter === "archived" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("archived")}
            >
              Archived
            </Button>
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <NoteList 
            onEdit={handleEdit} 
            filter={filter} 
            search={search}
            tagId={selectedTagId}
          />
        </div>
      </main>

      <NoteEditor
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        note={editingNote}
      />
    </div>
  );
}
