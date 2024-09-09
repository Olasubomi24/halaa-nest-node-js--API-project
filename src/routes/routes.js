import express from 'express';
import merchantRouter from './merchant_routes.js';
import userRouter from './user_routes.js';
import productsRouter from './products_routes.js';
import orderRouter from './order_routes.js';
import categoryRouter from './category_routes.js';
import reviewsRouter from './reviews_routes.js';
import ratingRouter from './rating_routes.js';
import adminRouter from './admin_routes.js';
import cartRouter from './cart_routes.js';
import paymentRouter from './payment_routes.js';
import entertainRouter from './entertain_routes.js';
import quoteRouter from './quote_routes.js';
import listOfSchoolRouter from './list_of_school_routes.js';
import endosmentRouter from './endosment_routes.js';
import halalItemRouter from './halal_item_routes.js';


const mainRouter = express.Router();

mainRouter.use('/', merchantRouter);
mainRouter.use('/users', userRouter);
mainRouter.use('/products', productsRouter);
mainRouter.use('/products', productsRouter);
mainRouter.use('/orders', orderRouter);
mainRouter.use('/categories', categoryRouter);
mainRouter.use('/reviews', reviewsRouter);
mainRouter.use('/ratings', ratingRouter);
mainRouter.use('/admin', adminRouter);
mainRouter.use('/cart', cartRouter);
mainRouter.use('/payment', paymentRouter);
mainRouter.use('/entertain', entertainRouter);
mainRouter.use('/quote', quoteRouter);
mainRouter.use('/list_of_school', listOfSchoolRouter);
mainRouter.use('/endosment', endosmentRouter);
mainRouter.use('/halal_item', halalItemRouter);

export default mainRouter;
