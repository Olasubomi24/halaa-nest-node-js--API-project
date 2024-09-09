import express from 'express';
import { addBillingAddressController, deleteBillingAddressController, getBillingAddressesController, registerUserController, signInController, updateBillingAddressController } from '../controllers/user_controller/user_controller.js';

const userRouter = express.Router();

userRouter.post('/register_user', registerUserController);
userRouter.post('/sign_in', signInController);
userRouter.post('/add_shipping_address/:userId', addBillingAddressController);
userRouter.get('/shipping_addresses/:userId', getBillingAddressesController);
userRouter.post('/update_shipping_address/:billingAddressId', updateBillingAddressController);
userRouter.delete('/delete_shipping_address/:billingAddressId', deleteBillingAddressController);


export default userRouter;
