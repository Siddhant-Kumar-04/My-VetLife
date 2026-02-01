import express from 'express';
import {
  getPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
  addMedicalHistory,
  addVaccination
} from '../controllers/petController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getPets)
  .post(createPet);

router.route('/:id')
  .get(getPet)
  .put(updatePet)
  .delete(deletePet);

router.post('/:id/medical-history', authorize('doctor'), addMedicalHistory);
router.post('/:id/vaccinations', authorize('doctor'), addVaccination);

export default router;
