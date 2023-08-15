import asyncHandler from 'express-async-handler';
import { validateMongodbID } from "../utils/validateMongodbID.js";
import brandModel from '../models/brandModel.js';

const createBrand = asyncHandler(async (req, res) => {
    const { title } = req.body;
    try {
        if (!title) {
            return res.status(400).json({ message: 'Title is required.' });
        }
        const existingBrand = await brandModel.findOne({ title });
        if (existingBrand)return res.status(409).json({ message: 'Category with this title already exists.' });
        const newBrand = await brandModel.create({ title });
        return res.status(200).json({ message: 'Successfully created.', newBrand });
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while creating the brand.' });
    }
})

const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    validateMongodbID(id);
    try {
        const updatedBrand = await brandModel.findByIdAndUpdate(
            id, { title }, { new: true });
        updatedBrand.message = 'Successfully updated the category.';
        return res.status(200).json(updatedBrand);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while updating the brand.' });
    }
});

const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getBrand = await brandModel.findByIdAndUpdate(
            { _id: id },
            { $inc: { numSearchs: 1 } },
            { new: true }
        );
        res.status(203).json(getBrand);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while retrieving single brand.' });
    }
})

const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const allBrand = await brandModel.find();
        res.status(200).json(allBrand);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while retrieving all the category.' });
    }
})

const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBrand = await brandModel.findByIdAndDelete(id)
        if (!deletedBrand) return res.status(404).json({ message: 'Not found.' });
        return res.status(200).json(deletedBrand);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while deleting the category.' });
    }
})

export const Brand = { createBrand, updateBrand, getBrand, getAllBrand, deleteBrand};