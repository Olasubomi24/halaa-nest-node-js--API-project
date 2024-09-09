import express from 'express';
import { submitRatingController, fetchAverageRatingController } from '../controllers/reviews_rating_controller/rating_controller.js';

const ratingRouter = express.Router();

ratingRouter.post('/submit_rating', submitRatingController);
ratingRouter.get('/fetch_avg_rating/:productId', fetchAverageRatingController);

export default ratingRouter;
