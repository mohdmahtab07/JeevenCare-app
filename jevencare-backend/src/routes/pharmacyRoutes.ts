import express from 'express';
import {
  getPharmacies,
  getPharmacyById,
  updatePharmacyProfile,
  getMyPharmacyProfile,
} from '../controllers/pharmacyController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getPharmacies);
router.get('/:id', getPharmacyById);

// Protected routes (Pharmacy only)
router.get('/my-profile', protect, authorize('pharmacy'), getMyPharmacyProfile);
router.put('/profile', protect, authorize('pharmacy'), updatePharmacyProfile);

export default router;
