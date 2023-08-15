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

const cloudinaryUploadImg = async (fileToUploads) => {
    console.log('filetoUploads is', fileToUploads);
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploads, (result) => {
            resolve(
                {
                    url: result.secure_url,
                },
                {
                    resource_type: "auto"
                }
            );
        });
    });
};

export default cloudinaryUploadImg;

// cloudinary.uploader.upload('path_to_your_image.jpg')
//     .then(result => {
//         console.log('Image uploaded successfully:', result);
//     })
//     .catch(error => {
//         console.error('Error uploading image:', error);
//     });
