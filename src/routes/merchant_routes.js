import express from 'express';
import { activateSellerController, confirmMerchantRegistrationController, deactivateSellerController, displayMerchantDetailsController, getAllMerchantController } from '../controllers/merchant_controller/merchant_controller.js';
import { merchantPinController } from '../controllers/merchant_controller/merchantPinController.js';
import { merchantLoginController } from '../controllers/merchant_controller/merchant_login_controller.js';
import { getMerchantOrderStatsController, getProductsBelowStockThresholdController, getProductsByMerchantController, getTopSellingProductsByMerchantController } from '../controllers/merchant_controller/merchant_dashboard_controller.js';

const merchantRouter = express.Router();

merchantRouter.post('/register_merchant', confirmMerchantRegistrationController);
merchantRouter.post('/merchant_details', displayMerchantDetailsController);
merchantRouter.post('/merchant_pin/:merchantId', merchantPinController.createPIN);
merchantRouter.post('/merchant_login', merchantLoginController.login);
merchantRouter.get('/merchant_stats/:merchantId', getMerchantOrderStatsController);
merchantRouter.get('/merchant_products/:merchantId', getProductsByMerchantController);
merchantRouter.get('/merchant_top_products/:merchantId', getTopSellingProductsByMerchantController);
merchantRouter.get('/merchant_products_threshold/:merchantId', getProductsBelowStockThresholdController);
merchantRouter.get('/all_merchants', getAllMerchantController);
merchantRouter.post('/deactivate_merchant/:merchantId', deactivateSellerController);
merchantRouter.post('/activate_merchant/:merchantId', activateSellerController);




export default merchantRouter;
