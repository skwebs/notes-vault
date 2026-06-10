import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { NoteInput, UpdateNoteInput } from "@/schemas/notes";
import { ApiResponse } from "@/types";
import { Note, NoteWithRelations, NoteFilters } from "@/repositories/NoteRepository";
import { Tag } from "@/repositories/TagRepository";
import { TagInput } from "@/schemas/tags";

const fetchNotes = async (filters: NoteFilters = {}) => {
  const { search, tagId } = filters;
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (tagId) params.append("tagId", tagId);

  const { data } = await axios.get<ApiResponse<NoteWithRelations[]>>(`/api/notes?${params.toString()}`);
  return data.data || [];
};

const fetchNote = async (id: string) => {
  const { data } = await axios.get<ApiResponse<NoteWithRelations>>(`/api/notes/${id}`);
  return data.data;
};

export const useNotes = (filters: NoteFilters = {}) => {
  return useQuery({
    queryKey: ["notes", filters],
    queryFn: () => fetchNotes(filters),
  });
};

export const useNote = (id: string) => {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: () => fetchNote(id),
    enabled: !!id,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (note: NoteInput) => {
      const { data } = await axios.post<ApiResponse<Note>>("/api/notes", note);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useUpdateNote = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (note: UpdateNoteInput) => {
      const { data } = await axios.patch<ApiResponse<Note>>(`/api/notes/${id}`, note);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useArchiveNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.post(`/api/notes/${id}/archive`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
    },
  });
};

export const useRestoreNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.post(`/api/notes/${id}/restore`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
    },
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<Tag[]>>("/api/tags");
      return data.data || [];
    },
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tag: TagInput) => {
      const { data } = await axios.post<ApiResponse<Tag>>("/api/tags", tag);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
