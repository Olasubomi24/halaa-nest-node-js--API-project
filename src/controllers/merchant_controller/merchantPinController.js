// controllers/pinController.js

import { StatusCodes } from "http-status-codes";
import { merchantPinService } from "../../services/merchant_service/merchantPinService.js";

const merchantPinController = {
    async createPIN(req, res, next) {
        const { merchantId } = req.params;
        const { pin } = req.body;

        try {
            await merchantPinService.createPIN(merchantId, pin);
            res.status(StatusCodes.OK).json({
                status_code: 0,
                message: 'PIN created successfully'
            });
        } catch (error) {
            if (error.message === 'PIN must be exactly 4 digits') {
                res.status(StatusCodes.OK).json({
                    status_code:1,
                    message: error.message
                });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
};

export { merchantPinController };
