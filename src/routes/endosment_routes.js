import express from 'express';
import { addEndosmentController,updateEndosmentController, deleteEndosmentController, endosmentListController, endosmentDetailsByIdController } from '../controllers/endosment_controller/endosment_controler.js';

const endosmentRouter = express.Router();


endosmentRouter.post('/add_endosment', addEndosmentController);
// endosmentRouter.post('/update_/:endosmentId', updateEndosmentController);
endosmentRouter.post('/delete_endosment/:endosmentId', deleteEndosmentController);
endosmentRouter.get('/endosment_list', endosmentListController);
endosmentRouter.get('/endosment_details/:schoolId', endosmentDetailsByIdController);
export default endosmentRouter;
