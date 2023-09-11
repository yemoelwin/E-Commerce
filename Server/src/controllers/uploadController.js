import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import { cloudinaryDeleteImg, cloudinaryUploadImg } from '../config/cloudinaryConfig.js';
import fs from 'fs';

// const uploadImagesAndFormatSizes = asyncHandler(async (req, res) => {
//     try { // Get product ID from route params
//         const imageFiles = req.files; // Using req.file because you're uploading a multi file
//         console.log("controller image files", imageFiles);
//         if (!imageFiles) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }
//         const maxFileSize = 5 * 1024 * 1024; // 5MB
//         if (imageFiles.size > maxFileSize) {
//             return res.status(400).json({ error: 'File size exceeds the limit' });
//         }
//         // Update product images and save
//         const uploadedImageUrls = [];
//         if (imageFiles !== undefined && imageFiles !== null) {
//             for (const file of imageFiles) {
//                 // const result = await cloudinaryUploadImg(file.path, {
//                 //     folder: "online-shop"
//                 // });
//                 // const uploader = async (path) => await cloudinaryUploadImg(path, "images")
//                 const imageInfo = {
//                     fileName: file.originalname,
//                     // filePath: file.path,
//                     fileType: file.mimetype,
//                     fileSize: fileSizeFormatter(file.size, 2),
//                     filePath: file.path,
//                 };
//                 uploadedImageUrls.push(imageInfo);
//             }
//             const newProduct = await Product.findOneAndUpdate()
//             newProduct.images = uploadedImageUrls;
//             // Format image sizes
//             return res.status(200).json({
//                 message: 'Product image updated successfully',
//                 newProduct,
//             });
//         }
//     } catch (error) {
//         console.log('error', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// });

const uploadImages = asyncHandler(async (req, res) => {
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
        const { path } = file;
        const newpath = await uploader(path);
        console.log(newpath);
        urls.push(newpath);
        fs.unlinkSync(path);
        }
        const images = urls.map((file) => {
        return file;
        });
        res.json(images);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = cloudinaryDeleteImg(id, 'images');
        res.status(200).json({message: 'Deleted', deleted})
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'Error occurred while deleting the cloudinary image',
            error: error.message
        })
    }
})

const fileSizeFormatter = (bytes, decimal = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimal)) + ' ' + sizes[i];
};

export const uploadImageController = { uploadImages, deleteImage };