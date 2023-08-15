import asyncHandler from 'express-async-handler';
import { validateMongodbID } from '../utils/validateMongodbID.js';
import categoryModel from '../models/productCategory.js';

const createCategory = asyncHandler(async (req, res) => {
    const { title } = req.body;
    try {
        if (!title) {
            return res.status(400).json({ message: 'Title is required.' });
        }
        const existingCategory = await categoryModel.findOne({ title });
        if (existingCategory)return res.status(409).json({ message: 'Category with this title already exists.' });
        const category = await categoryModel.create({ title });
        return res.status(200).json({ message: 'Successfully created.', category });
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while creating the category' });
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    validateMongodbID(id);
    console.log('cateGoryId', id);
    try {
        const updatedCategory = await categoryModel.findByIdAndUpdate(id, {title}, { new: true });
        updatedCategory.message = 'Successfully updated the category.';
        return res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while updating the category.' });
    }
})

const fetchCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        let category = await categoryModel.findOneAndUpdate(
            { _id: id },
            { $inc: { numSearchs: 1 } },
            { new: true }
        );
        if (!category) {
            // Category not found, handle the case separately
            return res.status(404).json({ message: 'Category not found.' });
        }
        res.status(203).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while searching the category.' });
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await categoryModel.findByIdAndDelete(id)
        if (!deleteCategory) return res.status(404).json({ message: 'Not found.' });
        return res.status(200).json(deletedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while deleting the category.' });
    }
})

const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const allCategory = await categoryModel.find();
        res.status(200).json(allCategory)
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while searching all the category.' });
    }
})

export const Category = { createCategory, updateCategory, fetchCategoryById, deleteCategory, getAllCategory }