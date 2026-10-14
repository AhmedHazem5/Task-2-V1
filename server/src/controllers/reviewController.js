import { Review } from '../models/Review.js';
import Joi from 'joi';

const createSchema = Joi.object({
  mealCode: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow(''),
  reviewedBy: Joi.string().hex().length(24)
});
// GET /api/reviews
// TODO: implement per README.md section 2.
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json({ reviews });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
// TODO: implement per README.md section 2.
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
// TODO: implement per README.md section 2.
export async function createReview(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const review = await Review.create(value);
    res.status(201).json({ review });
  } catch (err) { next(err); }
}



export async function getTopMeals(req, res, next) {
  try {
    const limit = req.query.limit === undefined
      ? 5
      : Number(req.query.limit);

    if (!Number.isSafeInteger(limit) || limit <= 0) {
      return res.status(400).json({
        message: 'limit must be a positive integer'
      });
    }
    const topMeals = await Review.aggregate([
      {
        $group: {
          _id: '$mealCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      },
      {
        $sort: { averageRating: -1, reviewCount: -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 0,
          mealCode: '$_id',
          averageRating: 1,
          reviewCount: 1
        }
      }
    ]);
    res.json({ top: topMeals });
  } catch (err) { next(err); }
}