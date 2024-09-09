import express from 'express';
import { addListOfSchoolController, updateSchoolListController,schoolDetailController, deleteSchoolController, schoolListController, schoolListByIdController } from '../controllers/list_of_school/list_of_school_controller.js';
import upload from '../middleware/muttlerMiddleware.js';

const listOfSchoolRouter = express.Router();


listOfSchoolRouter.post('/add_list_of_school', upload.fields([
    { name: 'image_1', maxCount: 5 }, // Adjust as needed
    { name: 'image_2', maxCount: 5 }  // Adjust as needed
]), addListOfSchoolController);
listOfSchoolRouter.post('/update_list_of_school/:schoolId',upload.fields([{ name: 'image_1', maxCount: 10 }, { name: 'image_2', maxCount: 10 }]), updateSchoolListController);
listOfSchoolRouter.post('/delete_list_of_school/:schoolId', deleteSchoolController);
listOfSchoolRouter.get('/school_list', schoolListController);
listOfSchoolRouter.get('/school_detail', schoolDetailController);
listOfSchoolRouter.get('/school_list_details/:schoolId', schoolListByIdController);
export default listOfSchoolRouter;
