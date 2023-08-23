import sharp from 'sharp';
import fs from 'fs';

export const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    console.log("hello req.files",req.files);
    await Promise.all(
        req.files.map(async (file) => {
        await sharp(file.path)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`src/public/images/products/${file.filename}`);
        fs.unlinkSync(`src/public/images/products/${file.filename}`);
        })
    );
    next();
};

export const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
        await sharp(file.path)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/images/blogs/${file.filename}`);
        fs.unlinkSync(`public/images/blogs/${file.filename}`);
        })
    );
    next();
};


// export const productImgResize = async (req, res, next) => {
//     if (!req.files) return next();

//     try {
//         await Promise.all(req.files.map(async (file) => {
//             const resizedImageBuffer = await sharp(file.path)
//                 .resize(300, 300)
//                 .toFormat('jpeg')
//                 .jpeg({ quality: 90 })
//                 // .toBuffer()
//                 .toFile(`src/public/images/products/${file.filename}`)
            
//             const destinationPath = `./src/public/images/products/${file.filename}`;
//             console.log('Destination Path:', destinationPath);
            
//             // Check if destination folder exists, if not, create it
//             await fs.mkdir('./src/public/images/products', { recursive: true });
            
//             // Check buffer size
//             console.log('Buffer size:', resizedImageBuffer.length);
            
//             // Write the buffer to the file
//             console.log('Type of resizedImageBuffer:', typeof resizedImageBuffer);
//             await fs.writeFile(destinationPath, resizedImageBuffer);
            
//             // Optionally, you can delete the original uploaded image file
//             // await fs.unlink(file.path);
//         }));
        
//         next();
//     } catch (error) {
//         console.error('Error resizing images:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// }

// export const blogImgResize = async (req, res, next) => {
//     if (!req.files) return next();

//     try {
//         await Promise.all(req.files.map(async (file) => {
//             const resizedImageBuffer = await sharp(file.path)
//                 .resize(300, 300)
//                 .toFormat('jpeg')
//                 .jpeg({ quality: 90 })
//                 .toFile(`src/public/images/blogs/${file.filename}`)
            
//             const destinationPath = `./src/public/images/blogs/${file.filename}`;
//             console.log('Destination Path:', destinationPath);
            
//             // Check if destination folder exists, if not, create it
//             await fs.mkdir('./src/public/images/blogs', { recursive: true });
            
//             // Check buffer size
//             console.log('Buffer size:', resizedImageBuffer.length);
            
//             // Write the buffer to the file
//             await fs.writeFile(destinationPath, resizedImageBuffer);
            
//             // Optionally, you can delete the original uploaded image file
//             // await fs.unlink(file.path);
//         }));
        
//         next();
//     } catch (error) {
//         console.error('Error resizing images:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// }
