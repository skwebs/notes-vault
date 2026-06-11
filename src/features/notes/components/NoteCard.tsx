import { NoteWithRelations } from "@/repositories/NoteRepository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, ArchiveRestore, Trash2, Edit, Paperclip, ExternalLink, Download, FileText } from "lucide-react";
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
      <CardContent className="space-y-4">
        <p className="text-sm line-clamp-3 text-muted-foreground">
          {note.content || "No content"}
        </p>

        {note.attachments && note.attachments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Paperclip className="w-3 h-3" />
              <span>Attachments ({note.attachments.length})</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {note.attachments.map((attachment) => {
                const isImage = attachment.fileType?.startsWith("image/");
                return (
                  <div key={attachment.id} className="group relative border rounded-md overflow-hidden bg-muted/50 h-20">
                    {isImage ? (
                      <img 
                        src={attachment.fileUrl} 
                        alt="attachment" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                        <FileText className="w-6 h-6 text-muted-foreground mb-1" />
                        <span className="text-[10px] truncate w-full px-1 font-mono uppercase">
                          {attachment.fileType?.split("/")[1] || "FILE"}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a 
                        href={attachment.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 bg-background rounded-full hover:bg-accent text-foreground transition-colors"
                        title="View"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a 
                        href={attachment.fileUrl} 
                        download
                        className="p-1.5 bg-background rounded-full hover:bg-accent text-foreground transition-colors"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1 items-center pt-2 border-t">
          {note.tags?.map((nt) => (
            <Badge key={nt.tagId} variant="secondary" className="text-[10px] px-1.5 py-0">
              {nt.tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
