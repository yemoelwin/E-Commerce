import multer from "multer";
import path from "path";
import fs from "fs";

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		console.log("image files middleware", file);
		cb(null, `./src/public/images`);
	},
	filename: function (req, file, cb) {
		const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
	},
});

const fileFilter = (req, file, cb) => {
	const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
	const extname = allowedFileTypes.test(
		path.extname(file.originalname).toLowerCase(),
	);
	const mimetype = allowedFileTypes.test(file.mimetype);

	if (mimetype && extname) {
		// Accept the file
		cb(null, true);
	} else {
		// Reject the file
		cb(new Error("Only JPEG, JPG, PNG, and GIF files are allowed."), false);
	}
};

export const productUpload = multer({
	storage: fileStorage,
	fileFilter: fileFilter,
	limits: { fileSize: 2000000 }, // Set the file filter function
});

export const blogUpload = multer({
	storage: fileStorage,
	fileFilter: fileFilter,
	limits: { fileSize: 2000000 }, // Set the file filter function
});

// const productMiddleware = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, `./src/public/images/products`); // Change 'uploads/' to your desired upload directory
//         },
//         filename: function (req, file, cb) {
//             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//             cb(null, uniqueSuffix + '-' + file.originalname);
//         }
//     }),
//     fileFilter: fileFilter,
//     limits: { fileSize : 2000000 },
// })

// const blogMiddleware = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, `./src/public/images/blogs`); // Change 'uploads/' to your desired upload directory
//         },
//         filename: function (req, file, cb) {
//             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//             cb(null, uniqueSuffix + '-' + file.originalname);
//         }
//     }),
//     fileFilter: fileFilter,
//     limits: { fileSize : 2000000 },
// })

// export { productMiddleware, blogMiddleware } ;
