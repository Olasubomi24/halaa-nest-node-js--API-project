import { response } from "express";
import { sendVerifyOtp, debitZippyWallet } from "../../services/payment_service/pay_with_zippy.js";
import { StatusCodes } from "http-status-codes";


export const sendOtpController = async (req, res) => {
    try {
        const { zippy_wallet_number, pin, name, email, security_answer, service_amount } = req.body;

        // Check for missing fields
        if (!zippy_wallet_number || !pin || !name || !email || !security_answer || !service_amount) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status_code: 1,
                message: 'Missing required fields.'
            });
        }

        const otpData = {
            customerId: zippy_wallet_number,
            pin,
            name,
            email,
            securityAnswer: security_answer,
            serviceAmount: service_amount,
            serviceType: 'service_type',
        };

        const result = await sendVerifyOtp(otpData);

        if (result.status_code === 1) {
            return res.status(StatusCodes.OK).json({
                status_code: 1,
                message: result.message
            });
        }

        res.status(StatusCodes.OK).json({
            status_code: 0,
            message: 'OTP sent Successfully',
            otpDetails: result.result
        });

    } catch (error) {
        console.error('Error sending OTP:', error.message); 

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status_code: 1,
            message: 'Failed to send OTP',
            error: error.message
        });
    }
};



export const debitWalletController = async (req, res) => {
    try {
        const { zippy_wallet_number, pin, name, otp, security_answer, service_amount } = req.body;

        // Check for missing fields
        if (!zippy_wallet_number || !pin || !name || !otp || !security_answer || !service_amount) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status_code: 1,
                message: 'Missing required fields.'
            });
        }

        const debitData = {
            customerId: zippy_wallet_number,
            "pin": pin,
            "otp": otp,
            "securityAnswer": security_answer,
            "serviceAmount": service_amount,
            "summary": "Test Debit",
            "serviceAccountNo": "1000000085",
            "provider": "MARKET PLACE",
            "operationEvent": "MAIN",
            "operationType": "DR"
        };

        const result = await debitZippyWallet(debitData);

        if (result.status_code === 1) {
            return res.status(StatusCodes.OK).json({
                status_code: 1,
                message: result.message
            });
        }

        res.status(StatusCodes.OK).json({
            status_code: 0,
            message: 'Wallet has been debitted successfully',
            otpDetails: result.result
        });

    } catch (error) {
        console.error('Error sending OTP:', error.message);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status_code: 1,
            message: 'Failed to send OTP',
            error: error.message
        });
    }
};