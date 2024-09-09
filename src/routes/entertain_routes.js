import express from 'express';
import { addVideoController, updateVideoController, deleteVideoController, videoListController, videoDetailsByIdController } from '../controllers/entertain_controller/entertain_controller.js';
// import { reduceProductQuantity } from '../services/entertain_service/entertain_service.js';
// import upload from '../middleware/muttlerMiddleware.js';

//const entertainRouter = express.Router();
const entertainRouter = express.Router();


entertainRouter.post('/add_video', addVideoController);
entertainRouter.post('/update_video/:videoId', updateVideoController);
entertainRouter.post('/delete_video/:videoId', deleteVideoController);
entertainRouter.get('/video_list', videoListController);
entertainRouter.get('/video_details/:videoId', videoDetailsByIdController);
export default entertainRouter;
