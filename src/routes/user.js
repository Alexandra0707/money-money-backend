import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { getUserByIdController, updateUserByIdController } from '../controllers/user.js';
import { isValidId } from '../middlewares/isValidID.js';




const router = express.Router();
const jsonParser = express.json();



router.get("/:id", isValidId, ctrlWrapper(getUserByIdController));
router.patch('/:id', isValidId, jsonParser, ctrlWrapper(updateUserByIdController));



export default router;