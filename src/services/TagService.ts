import { tagRepository } from "@/repositories/TagRepository";
import { TagInput } from "@/schemas/tags";

export class TagService {
  async getTags() {
    return await tagRepository.findAll();
  }

  async createTag(data: TagInput) {
    const existing = await tagRepository.findByName(data.name);
    if (existing) return existing;
    return await tagRepository.create(data);
  }
}

export const tagService = new TagService();
