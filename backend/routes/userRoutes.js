import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount
} from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile)
  .delete(deleteUserAccount);

export default router;
