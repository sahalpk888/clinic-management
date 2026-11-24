
import { Readable } from "node:stream";
import cloudinary from "../configs/cloudinary.js";





interface UploadResult {
  secure_url: string;
  public_id: string;
}
export const uploadImage = (file: Express.Multer.File,folder: string): Promise<UploadResult> => {

  return new Promise((resolve, reject) => {

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload failed"));

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        
        });
      }
    );

    uploadStream.end(file.buffer);       
  });
};


// Delete image from Cloudinary
export const deleteImage = async (publicId: string) => {

  return await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

};


