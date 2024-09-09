import express from 'express';
import { addQuoteController, updateQuoteController, deleteQuoteController, quoteListController, quoteDetailsByIdController } from '../controllers/quote_controller/quote_controller.js';

const quoteRouter = express.Router();


quoteRouter.post('/add_quote', addQuoteController);
quoteRouter.post('/update_quote/:quoteId', updateQuoteController);
quoteRouter.post('/delete_quote/:quoteId', deleteQuoteController);
quoteRouter.get('/quote_list', quoteListController);
quoteRouter.get('/quote_details', quoteDetailsByIdController);
export default quoteRouter;
