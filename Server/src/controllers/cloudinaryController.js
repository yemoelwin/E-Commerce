import { v2 as cloudinaryV2 } from 'cloudinary';

export const uploadToCloudinary = async (buffer, folder) => {
    try {
        const result = await cloudinaryV2.uploader.upload(buffer, {
            folder: folder,
            resource_type: 'image'
        });
        return result.secure_url; // Return the URL of the uploaded image
    } catch (error) {
        throw new Error('Error uploading image to Cloudinary');
    }
};