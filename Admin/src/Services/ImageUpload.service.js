import { apiClient } from "@/utils/api-client";
import { ADMIN_UPLOAD_PIZZA_IMAGE } from "@/utils/constant";
import { toast } from "sonner";

/**
 * 
 * @param {File} image An Image file to be uploaded
 * @returns {Promise<string>} The URL of the uploaded image
 * @description This function handles the image upload process which uploads the image to the server locally using multer.
 */
export const handleImageUploadLocally = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const response = await apiClient.post(ADMIN_UPLOAD_PIZZA_IMAGE, formData, {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.imageUrl;
    } else {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    toast.error("Error uploading image");
    return;
  }
};

/**
 * 
 * @param {File} image An Image file to be uploaded
 * @returns {Promise<string>} The URL of the uploaded image
 * @description This function handles the image upload process which uploads the image to the Cloudinary server and returns the Url string.
 */
export const handleImageUploadCloudinary = async (image) => {
  try {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "pizza-image");
    formData.append("cloud_name", "dkkxqjz4v");
    const response = await apiClient.post(
      "https://api.cloudinary.com/v1_1/dkkxqjz4v/image/upload",
      formData
    );
    if (response.status === 200) {
      return response.data.secure_url;
    } else {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    toast.error("Error uploading image");
    return;
  }
};

/**
 * 
 * @param {string} publicId The public ID of the image to be deleted
 * @returns {Promise<void>} 
 * @description This function handles the image deletion process which deletes the image from the Cloudinary server.
 */
export const handleImageDeleteClodinary = async (publicId) => {
}