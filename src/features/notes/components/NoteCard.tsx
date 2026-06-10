import { NoteWithRelations } from "@/repositories/NoteRepository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, ArchiveRestore, Trash2, Edit, Paperclip } from "lucide-react";
import { useArchiveNote, useRestoreNote, useDeleteNote } from "../api/useNotes";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface NoteCardProps {
  note: NoteWithRelations;
  onEdit: (note: NoteWithRelations) => void;
}

export function NoteCard({ note, onEdit }: NoteCardProps) {
  const archiveMutation = useArchiveNote();
  const restoreMutation = useRestoreNote();
  const deleteMutation = useDeleteNote();

  const handleArchive = async () => {
    try {
      await archiveMutation.mutateAsync(note.id);
      toast.success("Note archived");
    } catch {
      toast.error("Failed to archive note");
    }
  };

  const handleRestore = async () => {
    try {
      await restoreMutation.mutateAsync(note.id);
      toast.success("Note restored");
    } catch {
      toast.error("Failed to restore note");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteMutation.mutateAsync(note.id);
        toast.success("Note deleted");
      } catch {
        toast.error("Failed to delete note");
      }
    }
  };

  return (
    <Card className={note.isArchived ? "opacity-60" : ""}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">{note.title}</CardTitle>
          <p className="text-xs text-muted-foreground">
            Updated {formatDistanceToNow(new Date(note.updatedAt))} ago
          </p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(note)}>
            <Edit className="w-4 h-4" />
          </Button>
          {note.isArchived ? (
            <Button variant="ghost" size="icon" onClick={handleRestore}>
              <ArchiveRestore className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={handleArchive}>
              <Archive className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-500 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3 text-muted-foreground mb-4">
          {note.content || "No content"}
        </p>
        <div className="flex flex-wrap gap-1 items-center">
          {note.tags?.map((nt) => (
            <Badge key={nt.tagId} variant="secondary" className="text-[10px] px-1.5 py-0">
              {nt.tag.name}
            </Badge>
          ))}
          {note.attachments && note.attachments.length > 0 && (
            <div className="flex items-center gap-1 ml-auto text-xs text-muted-foreground">
              <Paperclip className="w-3 h-3" />
              {note.attachments.length}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
