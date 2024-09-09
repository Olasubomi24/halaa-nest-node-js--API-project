import { StatusCodes } from 'http-status-codes';
import { getMerchantOrderStats, getProductsByMerchant, getTopSellingProductsByMerchant, getProductsBelowStockThreshold } from '../../services/merchant_service/merchant_dashbaoard_service.js';

export const getMerchantOrderStatsController = async (req, res) => {
    try {
        const { merchantId } = req.params;
        const { startDate, endDate } = req.query;


        const stats = await getMerchantOrderStats(merchantId, startDate, endDate);

        res.status(StatusCodes.OK).json({
            status_code: 0,
            message: 'Merchant order stats retrieved successfully',
            data: stats
        });
    } catch (error) {
        console.error("Error fetching merchant order stats:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status_code: 1,
            message: error.message
        });
    }
};


export const getProductsByMerchantController = async (req, res) => {
    try {
        const { merchantId } = req.params;

        if (!merchantId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status_code: 1,
                message: 'Missing required parameter: merchantId'
            });
        }

        const products = await getProductsByMerchant(merchantId);

        res.status(StatusCodes.OK).json({
            status_code: 0,
            message: 'Products retrieved successfully',
            data: products
        });
    } catch (error) {
        console.error("Error fetching products by merchant:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status_code: 1,
            message: error.message
        });
    }
};

export const getTopSellingProductsByMerchantController = async (req, res) => {
    try {
        const { merchantId } = req.params;

        const topSellingProducts = await getTopSellingProductsByMerchant(merchantId);

        res.status(StatusCodes.OK).json({
            status_code: 0,
            message: 'Top-selling products by merchant retrieved successfully',
            data: topSellingProducts
        });
    } catch (error) {
        console.error("Error fetching top-selling products by merchant:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status_code: 1,
            message: error.message
        });
    }
};


export const getProductsBelowStockThresholdController = async (req, res) => {
    try {
        const { merchantId } = req.params;
        const { threshold } = req.query;

        if (!threshold || isNaN(threshold)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status_code: 1,
                message: 'Invalid or missing required parameter: threshold'
            });
        }

        // Call the service function to get products below the stock threshold by merchant
        const productsBelowThreshold = await getProductsBelowStockThreshold(merchantId, threshold);

        res.status(StatusCodes.OK).json({
            status_code: 0,
            message: 'Products below stock threshold by merchant retrieved successfully',
            data: productsBelowThreshold
        });
    } catch (error) {
        console.error("Error fetching products below stock threshold by merchant:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status_code: 1,
            message: error.message
        });
    }
};