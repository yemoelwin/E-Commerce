import BlogModel from '../models/blogModel.js';
import asyncHandler from 'express-async-handler';
import { validateMongodbID } from "../utils/validateMongodbID.js";
import fs from 'fs';

const createBlog = asyncHandler(async (req, res) => {
    const { title, category, description, images } = req.body;
    try {
        const blog = await BlogModel.findOne({
            title,
            category,
            description,
            images
        });
        if (!category) {
        return res.status(400).json({
            message: 'Category is required.'
        });
    }
        if(blog) return res.status(409).json({message: 'Blog already created.'})
        const createdBlog = new BlogModel({
            title,
            category,
            description,
            images
        });
        await createdBlog.save();
        console.log('newBlogData', createdBlog);
        return res.status(200).json({
            data: createdBlog,
            message: 'Successfully created blog.'
        });
    } catch (error) {
        console.error('Error creating blog:', error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

/* Need to fix to show the error 404 when its not found. */
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbID(id);
    const { title, category, description } = req.body;
    try {
        const blog = await BlogModel.findByIdAndUpdate(
            id,
            { title, category, description },
            { new: true }
        )
        if (!blog) {
            return res.status(404).json({message: 'Not Found!'})
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
})

/* Need to fix to show the error 404 when its not found. */
const getBlogById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        // Find the blog by its ID and increment the view count
        const blog = await BlogModel.findByIdAndUpdate(
            id,
            { $inc: { numViews: 1 } },
            { new: true }
        );
        if (!blog) {
            // Handle the "Not Found" case when the blog is not found
            return res.status(404).json({
                status: 'FAILED',
                message: 'Blog not found.',
            });
        }
        res.status(200).json(blog);
    } catch (error) {
        console.error('Error while fetching the data:', error);
        res.status(500).json({ message: 'Error Occurred while fetching the data' });
    }
});

const fetchAllBlogs = asyncHandler(async (req, res) => {
    try {
        const allBlog = await BlogModel.find();
        return res.status(200).json(allBlog)
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'Error occurred while fetching all the blog product',
            error: error.message
        })
    }
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBlog = await BlogModel.findByIdAndDelete(id);
        if(!deletedBlog)return res.status(404).json({message: 'Not Found.'})
        return res.status(200).json({
            status: 'SUCCESS',
            message: 'successfully deleted.',
            deletedBlog
        })
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'Error occurred while deleting the blog product',
            error: error.message
        })
    }
});

const OptLikedAndDisLiked = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    console.log('blogId', blogId);
    validateMongodbID(blogId);
    
    try {
        const blog = await BlogModel.findById(blogId);/* Find the blog which you want to be liked. */
        if (!blog) return res.status(404).json({ message: 'Not Found!' });
        const loginUserId = req?.user?._id; /* Find the login user. */
        console.log('loginUserID is', loginUserId);

        const isLiked = blog?.isLiked; /* Find if the user has liked the blog. */
        console.log("has already liked the blog", isLiked);
        const disLiked = blog?.dislikes?.find(userId => userId?.toString() === loginUserId?.toString());
        console.log('disliked', disLiked);
        if (disLiked) {
            const blog = await BlogModel.findByIdAndUpdate(blogId,
                {
                    $pull: { dislikes: loginUserId },
                    isDisliked: false
                },
                {
                    new: true
                });
            res.json(blog);
        }
        if (isLiked) {
            const blog = await BlogModel.findByIdAndUpdate(blogId,
                {
                    $pull: { likes: loginUserId },
                    isLiked: false,
                },
                {
                    new: true
                });
            res.json(blog);
        } else {
            const blog = await BlogModel.findByIdAndUpdate(blogId,
                {
                    $push: { likes: loginUserId },
                    isLiked: true,
                },
                {
                    new: true
                });
            res.json(blog);
        }
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'Error occurred while fetching the blog product',
            error: error.message
        });
    }
});

const isLikedAndDisLiked = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.body.userId;
    console.log('userId', userId);
    try {
        const blog = await BlogModel.findById(id);
        if (!blog) return res.status(404).json({ message: 'Blog Not Found!' });
        /* find the user that already liked the blog in the likes array */
        const hasLiked = blog.likes.includes(userId);
        console.log('hasLikedArray', hasLiked);
        /* find the user that already disliked the blog in the dislikes array */
        const hasDisLiked = blog.dislikes.includes(userId);
        console.log('hasDisLikedArray', hasDisLiked);
        
        if (hasLiked && !hasDisLiked) {
            const likeIndex = blog.likes.indexOf(userId);
            blog.likes.splice(likeIndex, 1);
            blog.dislikes.push(userId);
            blog.isLiked = false;
            blog.isDisliked = true;
            await blog.save();
            res.status(200).json({ message: 'Blog disliked successfully.' });
        } else if (!hasLiked && hasDisLiked) {
            const disLikeIndex = blog.dislikes.indexOf(userId);
            blog.dislikes.splice(disLikeIndex, 1);
            blog.likes.push(userId);
            blog.isLiked = true;
            blog.isDisliked = false;
            await blog.save();
            res.status(200).json({ message: 'Blog liked successfully.' });
        } else if (!hasLiked && !hasDisLiked) {
            blog.likes.push(userId);
            blog.isLiked = true;
            await blog.save();
            res.status(200).json({ message: 'Blog Liked Successfully.' });
        } else {
            return res.status(400).json({ message: 'Error occcurred while liking and disliking the blog.' });
        }
    } catch (error) {
        
    }
});

const toggleLikeAndDislike  = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbID(blogId);
    try {
        const blog = await BlogModel.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'Blog Not Found.' });
        const loginUserId = req.user._id;
        const hasLiked = blog.likes.includes(loginUserId);
        const hasDisLiked = blog.dislikes.includes(loginUserId);

        if (hasDisLiked) {
            const blog = await BlogModel.findByIdAndUpdate(blogId,
                {
                    $addToSet: { likes: req.user?._id },
                    $pull: { dislikes: req.user?._id },
                    isLiked: true,
                    isDisliked: false
                },
                { new: true }
                )  
            res.json(blog);

        } else if (hasLiked) {
            const blog = await BlogModel.findByIdAndUpdate(blogId,
                {
                    $addToSet: { dislikes: req.user?._id },
                    $pull: { likes: req.user?._id },
                    isLiked: false,
                    isDisliked: true,
                },
                { new: true }
                )  
            res.json(blog);

        } else {
            const blog = await BlogModel.findByIdAndUpdate(blogId,
                {
                    $addToSet: { likes: req.user?._id },
                    isLiked: true,
                },
                { new: true }
                )  
            res.json(blog);
        }
    } catch (error) {
        res.status(500).json({
        status: 'FAILED',
        message: 'Error occurred while fetching the blog product',
        error: error.message,
        });
    }
});

// const uploadBlogImages = asyncHandler(async (req, res) => {
//     try {
//         const { id } = req.params; // Get product ID from route params
//         const imageFiles = req.files; // Using req.file because you're uploading a multi file
//         if (!imageFiles) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }
//         const maxFileSize = 5 * 1024 * 1024; // 5MB
//         if (imageFiles.size > maxFileSize) {
//             return res.status(400).json({ error: 'File size exceeds the limit' });
//         }
//         const blog = await blogModel.findById(id);
//         if (!blog) {
//             return res.status(404).json({ error: 'Product not found' });
//         }
//         if (blog.author !== id) {
//             return res.status(403).json({ error: 'Unauthorized: You do not own this blog' });
//         }
//         const prevImages = blog.images.map(image => image.filePath);
//         for (let prevImage of prevImages) {
//             try {
//                 fs.unlinkSync(prevImage); // Delete the file synchronously
//             } catch (error) {
//                 console.error('Error deleting old image:', error);
//             }
//         }
//         const uploadedImageUrls = [];
//         if (imageFiles !== undefined && imageFiles !== null) {
//             for (const file of imageFiles) {                
//                 const imageInfo = {
//                     fileName: file.originalname,
//                     filePath: file.path,
//                     fileType: file.mimetype,
//                     fileSize: fileSizeFormatter(file.size, 2),
//                 } 
//                 uploadedImageUrls.push(imageInfo);
//             }
//             blog.images = uploadedImageUrls;
//             const blogImages = await blog.save();      
//             return res.status(200).json({
//                 message: 'Product image updated successfully',
//                 blogImages,
//             });
//         }
//     } catch (error) {
//         console.log('error', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// });

const fileSizeFormatter = (bytes, decimal = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimal)) + ' ' + sizes[i];
}



export const Blog = { createBlog, updateBlog, getBlogById, fetchAllBlogs, deleteBlog, OptLikedAndDisLiked, isLikedAndDisLiked, toggleLikeAndDislike  }