import express from 'express';
import { debitWalletController, sendOtpController } from '../controllers/payment_controller/pay_with_zippy_controller.js';

const paymentRouter = express.Router();

paymentRouter.post('/send_otp', sendOtpController);
paymentRouter.post('/debit_wallet', debitWalletController);

export default paymentRouter;
