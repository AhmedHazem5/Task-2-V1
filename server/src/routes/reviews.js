import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getTopMeals,
} from '../controllers/reviewController.js';

const router = Router();
router.get('/', getAllReviews);
router.get('/top', getTopMeals);
router.get('/:id', getReview);
router.post('/', createReview);


// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.

export default router;
