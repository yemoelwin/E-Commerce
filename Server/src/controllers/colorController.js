import asyncHandler from 'express-async-handler';
import { validateMongodbID } from "../utils/validateMongodbID.js";
import ColorModel from '../models/colorModel.js';

const createColor = asyncHandler(async (req, res) => {
    const { color } = req.body;
    try {
        if (!color) {
            return res.status(400).json({ message: 'color is required.' });
        }
        const existingColor = await ColorModel.findOne({ color });
        if (existingColor) {
            return res.status(200).json({ message: 'Category with this color already exists.' });
        }
        const newColor = await ColorModel.create({ color });
        return res.status(200).json({ message: 'Successfully created.', newColor });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Error Occurred while creating the Color.' });
    }
})

const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { color } = req.body;
    validateMongodbID(id);
    try {
        const updatedColor = await ColorModel.findByIdAndUpdate(
            id, { color }, { new: true });
        updatedColor.message = 'Successfully updated the category.';
        return res.status(200).json(updatedColor);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while updating the Color.' });
    }
});

const getColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const color = await ColorModel.findById(id)
        if(!color) return res.status(404).json({ message: 'Not Found.' })
        const getColor = await ColorModel.findByIdAndUpdate(
            { _id: id },
            { $inc: { numSearchs: 1 } },
            { new: true }
        );
        res.status(203).json(getColor);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while retrieving single Color.' });
    }
})

const getAllColor = asyncHandler(async (req, res) => {
    try {
        const allColor = await ColorModel.find();
        res.status(200).json(allColor);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while retrieving all the category.' });
    }
})

const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedColor = await ColorModel.findByIdAndDelete(id)
        if (!deletedColor) return res.status(404).json({ message: 'Not found.' });
        return res.status(200).json({ message: 'successfully deleted color', deletedColor });
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while deleting the category.' });
    }
})

export const Color = { createColor, updateColor, getColor, getAllColor, deleteColor};