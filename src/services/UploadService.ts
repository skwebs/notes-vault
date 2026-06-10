import { cloudinary } from "@/lib/cloudinary";
import { attachmentRepository } from "@/repositories/AttachmentRepository";

export class UploadService {
  async uploadFile(file: File, noteId: string) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "notes-vault",
          resource_type: "auto",
        },
        async (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload failed"));

          const attachment = await attachmentRepository.create({
            noteId,
            fileUrl: result.secure_url,
            publicId: result.public_id,
            fileType: result.format ? `${result.resource_type}/${result.format}` : result.resource_type,
          });

          resolve(attachment);
        }
      );

      uploadStream.end(buffer);
    });
  }

  async uploadAvatar(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "notes-vault/avatars",
          resource_type: "image",
          transformation: [{ width: 400, height: 400, crop: "fill" }],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload failed"));
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      );

      uploadStream.end(buffer);
    });
  }

  async deleteFile(publicId: string) {
    return await cloudinary.uploader.destroy(publicId);
  }
}

export const uploadService = new UploadService();
