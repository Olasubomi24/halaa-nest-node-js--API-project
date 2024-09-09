import express from 'express';
import { addHalalItemController,updateHalalItemController, deleteHalalItemController, halalItemListController,ListOfHalalItemController, halalItemDetailsByIdController } from '../controllers/halal_item_controller/halal_item_controller.js';

const halalItemRouter = express.Router();


halalItemRouter.post('/add_halal_item', addHalalItemController);
halalItemRouter.post('/update_halal_item/:HalalItemId', updateHalalItemController);
halalItemRouter.post('/delete_halal_item/:HalalItemId', deleteHalalItemController);
halalItemRouter.get('/list_of_item_on_halal_nest', halalItemListController);
halalItemRouter.get('/halal_item_list', ListOfHalalItemController);
halalItemRouter.get('/halal_item_details/:HalalItemId', halalItemDetailsByIdController);
export default halalItemRouter;
