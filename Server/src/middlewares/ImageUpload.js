import multer from 'multer';
import path from 'path';

// const getDestination = (req, file, cb) => {
//     const targetFolder = req.uploadFolder || 'default'; // Use 'default' if no uploadFolder specified
//     cb(null, `./src/public/images/${targetFolder}`);
// };

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only image files are allowed.'), false); // Reject the file
    }
};

const productMiddleware = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./src/public/images/products`); // Change 'uploads/' to your desired upload directory
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname);
        }
    }),
    fileFilter: fileFilter,
    limits: { fileSize : 2000000 },
})

const blogMiddleware = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./src/public/images/blogs`); // Change 'uploads/' to your desired upload directory
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname);
        }
    }),
    fileFilter: fileFilter,
    limits: { fileSize : 2000000 },
})

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize : 2000000 }, // Set the file filter function
// });

export { productMiddleware, blogMiddleware } ;