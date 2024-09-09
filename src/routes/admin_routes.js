import express from 'express';
import { createAdminController, loginAdminController } from '../controllers/admin_controller/admin_login_controller.js';

const adminRouter = express.Router();

adminRouter.post('/create_admin', createAdminController);
adminRouter.post('/admin_login', loginAdminController);

export default adminRouter;
