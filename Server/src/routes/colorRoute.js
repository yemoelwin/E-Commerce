import express from 'express';
import { Color } from '../controllers/colorController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-color/youngsone', protect, isAdmin, Color.createColor); /* finished */

router.put('/update/:id', protect, isAdmin, Color.updateColor); /* finished */

router.get('/:id', protect, isAdmin, Color.getColor); /* finished */

router.get('/', protect, Color.getAllColor); /* finished */

router.delete('/delete/:id', protect, isAdmin, Color.deleteColor); /* finished */

export default router;