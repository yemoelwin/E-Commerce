import blogModel from "../models/blogModel.js";
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import { validateMongodbID } from "../utils/validateMongodbID.js";

const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await blogModel.create(req.body);
        return res.status(200).json({
            status: 'SUCCESS',
            message: 'successfully created.',
            newBlog
        })
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'Error occurred while creating the blog product',
            error: error.message
        })
    }
});


/* Need to fix to show the error 404 when its not found. */
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbID(id);
    const { title, category, description } = req.body;
    try {
        const blog = await blogModel.findByIdAndUpdate(
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
        const blog = await blogModel.findByIdAndUpdate(
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
        const allBlog = await blogModel.find();
        return res.status(200).json({
            status: 'SUCCESS',
            allBlog
        })
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
        const deletedBlog = await blogModel.findByIdAndDelete(id);
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

const isLiked = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbID(blogId);
    try {
        const blog = await blogModel.findById(blogId);/* Find the blog which you want to be liked. */
        if (!blog) return res.status(404).json({ message: 'Not Found!' })
        const loginUserId = req?.user?._id; /* Find the login user. */
        const isLiked = blog?.likes; /* Find if the user has liked the blog. */
        const disLiked = blog?.dislikes?.find(
            (userId = userId?.toString() === loginUserId?.toString())
        );
        if (disLiked) {
            const blog = await blogModel.findByIdAndUpdate(blogId,
                {
                    $pull: { dislikes: loginUserId },
                    isDisliked: false
                },
                {
                    new: true
                });
            res.json(blog)
        }
        if (isLiked) {
            const blog = await blogModel.findByIdAndUpdate(blogId,
                {
                    $pull: { likes: loginUserId },
                    isLiked: false,
                },
                {
                    new: true
                });
            res.json(blog);
        } else {
            const blog = await blogModel.findByIdAndUpdate(blogId,
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
        }) 
    }
})

const LikedAndDisLiked = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        const blog = await blogModel.findById(id);
        if (!blog) return res.status(404).json({ message: 'Blog Not Found!' })
        /* find the user that already liked the blog in the likes array */
        const hasLiked = blog.likes.includes(userId)
        console.log('hasLikedArray', hasLiked);
        /* find the user that already disliked the blog in the dislikes array */
        const hasDisLiked = blog.dislikes.includes(userId);
        console.log('hasDisLikedArray', hasDisLiked);
        if (hasLiked && !hasDisLiked) {
            const likeIndex = blog.likes.indexOf(userId);
            blog.likes.splice(likeIndex, 1);
            blog.dislikes.push(userId)
            await blog.save()
            res.status(200).json({ message: 'Blog disliked successfully.' })
        } else if (!hasLiked && hasDisLiked) {
            const disLikeIndex = blog.dislikes.indexOf(userId);
            blog.dislikes.splice(disLikeIndex, 1);
            blog.likes.push(userId)
            await blog.save();
            res.status(200).json({ message: 'Blog liked successfully.' });
        } else if (!hasLiked && !hasDisLiked) {
            blog.likes.push(userId);
            await blog.save()
            res.status(200).json({ message: 'Blog Liked Successfully.' })
        } else {
            return res.status(400).json({ message: 'Error occcurred while liking and disliking the blog.'})
        }
    } catch (error) {
        
    }
})



export const Blog = { createBlog, updateBlog, getBlogById, fetchAllBlogs, deleteBlog, isLiked, LikedAndDisLiked }