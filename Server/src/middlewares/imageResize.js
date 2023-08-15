import sharp from 'sharp';
import fs from 'fs/promises';

export const productImgResize = async (req, res, next) => {
    if (!req.files) return next();

    try {
        await Promise.all(req.files.map(async (file) => {
            const resizedImageBuffer = await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                // .toBuffer()
                .toFile(`src/public/images/products/${file.filename}`)
            
            const destinationPath = `./src/public/images/products/${file.filename}`;
            console.log('Destination Path:', destinationPath);
            
            // Check if destination folder exists, if not, create it
            await fs.mkdir('./src/public/images/products', { recursive: true });
            
            // Check buffer size
            console.log('Buffer size:', resizedImageBuffer.length);
            
            // Write the buffer to the file
            console.log('Type of resizedImageBuffer:', typeof resizedImageBuffer);
            await fs.writeFile(destinationPath, resizedImageBuffer);
            
            // Optionally, you can delete the original uploaded image file
            // await fs.unlink(file.path);
        }));
        
        next();
    } catch (error) {
        console.error('Error resizing images:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();

    try {
        await Promise.all(req.files.map(async (file) => {
            const resizedImageBuffer = await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`src/public/images/blogs/${file.filename}`)
            
            const destinationPath = `./src/public/images/blogs/${file.filename}`;
            console.log('Destination Path:', destinationPath);
            
            // Check if destination folder exists, if not, create it
            await fs.mkdir('./src/public/images/blogs', { recursive: true });
            
            // Check buffer size
            console.log('Buffer size:', resizedImageBuffer.length);
            
            // Write the buffer to the file
            await fs.writeFile(destinationPath, resizedImageBuffer);
            
            // Optionally, you can delete the original uploaded image file
            // await fs.unlink(file.path);
        }));
        
        next();
    } catch (error) {
        console.error('Error resizing images:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
// import fs from 'fs';

// export const productImageResize = async (req, res, next) => {
//     if (!req.files) return next();
//     try {
//         const processedImages = [];
//         await Promise.all(
//             req.files.map(async (file) => {
//                 const imageBuffer = await sharp(file.path)
//                     .resize(300, 300)
//                     .toFormat('jpeg')
//                     .jpeg({ quality: 90 })
//                     .toBuffer();
                
//                 const result = await cloudinary.uploader.upload_stream(
//                     { resource_type: 'auto' },
//                     (error, result) => {
//                         if (error) {
//                             throw error;
//                         }
//                         processedImages.push(result.secure_url);
//                     }
//                 ).end(imageBuffer);
//             })
//         );
//         req.processedImages = processedImages;
//         next();
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// }
// //     await Promise.all(
// //         req.files.map(async (file) => {
// //             const imageBuffer = await sharp(file.path)
// //                 .resize(300, 300)
// //                 .toFormat('jpeg')
// //                 .jpeg({ quality: 90 })
// //                 .toBuffer()            
// //             const moduleFilePath = fileURLToPath(import.meta.url);
// //             const imageFolderPath = path.join(path.dirname(moduleFilePath), '../public/images/products');
// //             const imageFilePath = path.join(imageFolderPath, file.filename);

// //             fs.writeFileSync(imageFilePath, imageBuffer);
// //             // await uploadToCloudinary(imageBuffer, 'products', file.filename);
// //             // fs.unlinkSync(`src/public/images/products/${file.filename}`)
// //         })
// //     )
// //     next();
// // }

// // export const blogImageResize = async (req, res, next) => {
// //     if (!req.files) return next();
// //     await Promise.all(
// //         req.files.map(async (file) => {
// //             const imageBuffer = await sharp(file.path)
// //                 .resize(300, 300)
// //                 .toFormat('jpeg')
// //                 .jpeg({ quality: 90 })
// //                 .toBuffer()
// //                 // .toFile(`src/public/images/blogs/${file.filename}`)
// //             // await uploadToCloudinary(imageBuffer, 'blogs', file.filename);
// //         })
// //     )
// //     next();
// // }

