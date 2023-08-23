import asyncHandler from 'express-async-handler';
import { validateMongodbID } from "../utils/validateMongodbID.js";
import enquiryModel from '../models/enquiryModel.js';

const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const { name, email, mobile, comments } = req.body;
        const newEnquiry = await enquiryModel.create({ name, email, mobile, comments });        
        return res.status(201).json({ message: 'Enquiry successfully created.', newEnquiry });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Error occurred while creating the Enquiry.' });
    }
});

const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    validateMongodbID(id);
    try {
        const updatedEnquiry = await enquiryModel.findByIdAndUpdate(
            id, { status }, { new: true });
        updatedEnquiry.message = 'Successfully updated the category.';
        return res.status(200).json(updatedEnquiry);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while updating the Enquiry.' });
    }
});

const getEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const Enquiry = await enquiryModel.findById(id)
        if(!Enquiry) return res.status(404).json({ message: 'Not Found.' })
        const getEnquiry = await enquiryModel.findByIdAndUpdate(
            { _id: id },
            { $inc: { numSearchs: 1 } },
            { new: true }
        );
        res.status(203).json(getEnquiry);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while retrieving single Enquiry.' });
    }
})

const getAllEnquiry = asyncHandler(async (req, res) => {
    try {
        const allEnquiry = await enquiryModel.find();
        res.status(200).json(allEnquiry);
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while retrieving all the category.' });
    }
})

const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEnquiry = await enquiryModel.findByIdAndDelete(id)
        if (!deletedEnquiry) return res.status(404).json({ message: 'Not found.' });
        return res.status(200).json({ message: 'successfully deleted Enquiry', deletedEnquiry });
    } catch (error) {
        res.status(500).json({ message: 'Error Occurred while deleting the category.' });
    }
})

export const Enquiry = { createEnquiry, updateEnquiry, getEnquiry, getAllEnquiry, deleteEnquiry};