import asyncHandler from 'express-async-handler';
import { validateMongodbID } from "../utils/validateMongodbID.js";
import blogCategoryModel from '../models/blogCategory.js';

const createBlogCategory = asyncHandler(async (req, res) => {
    const { title } = req.body;
    try {
        if (!title) {
            return res.status(400).json({ message: 'Title is required.' });
        }
        const existingBlogCategory = await blogCategoryModel.findOne({ title });
        if (existingBlogCategory)return res.status(409).json({ message: 'Category with this title already exists.' });
        const blogCategory = await blogCategoryModel.create({ title });
        return res.status(200).json({ message: 'Successfully created.', blogCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while creating the category' });
    }
})

const updateBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    validateMongodbID(id);
    try {
        const updatedBlogCategory = await blogCategoryModel.findByIdAndUpdate(
            id, { title }, { new: true });
        updatedBlogCategory.message = 'Successfully updated the category.';
        return res.status(200).json(updatedBlogCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while updating the blog category.' });
    }
});

const getBlogCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getBlogCategory = await blogCategoryModel.findByIdAndUpdate(
            { _id: id },
            { $inc: { numSearchs: 1 } },
            { new: true }
        );
        res.status(203).json(getBlogCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while retrieving the blog category.' });
    }
})

const getAllBlogCategory = asyncHandler(async (req, res) => {
    try {
        const allBlogCategory = await blogCategoryModel.find();
        res.status(200).json(allBlogCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while retrieving all the category.' });
    }
})

const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBlogCategory = await blogCategoryModel.findByIdAndDelete(id)
        if (!deletedBlogCategory) return res.status(404).json({ message: 'Not found.' });
        return res.status(200).json(deletedBlogCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while deleting the category.' });
    }
})

export const BlogCategory = { createBlogCategory, updateBlogCategory, getBlogCategoryById, getAllBlogCategory, deleteBlogCategory };