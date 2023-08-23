// cloudinaryConfig.js

import cloudinary from 'cloudinary';
import dotenv from 'dotenv'
dotenv.config(); 

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    // secure: true,
});

// export const cloudinaryUploadImg = async (fileToUploads) => {
//     console.log('filetoUploads is', fileToUploads);
//     return new Promise((resolve) => {
//         cloudinary.uploader.upload(fileToUploads, (result) => {
//             resolve(
//                 {
//                     url: result.secure_url,
//                     asset_id: result.asset_id,
//                     public_id: result.public_id
//                 },
//                 {
//                     resource_type: "auto"
//                 }
//             );
//         });
//     });
// };

export const cloudinaryUploadImg = async (fileToUploads) => {
    console.log('filetoUploads is', fileToUploads);
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileToUploads, (error, result) => {
            if (error) {
                console.error('Error uploading to Cloudinary:', error);
                return reject(error);
            }
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id
            });
        });
    });
};

export const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(fileToDelete, (result) => {
        resolve(
            {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
            },
            {
            resource_type: "auto",
            }
        );
        });
    });
};

// cloudinary.uploader.upload('path_to_your_image.jpg')
//     .then(result => {
//         console.log('Image uploaded successfully:', result);
//     })
//     .catch(error => {
//         console.error('Error uploading image:', error);
//     });
