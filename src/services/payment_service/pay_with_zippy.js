// src/services/paymentService.mjs
import axios from 'axios';
import { zippyDebitApi, zippyOtpApi } from '../../utils/axios_utils.js';



const apiUrl = 'http://194.163.149.51:3009/api/v1';
const apiKey = '2aa1513c-8998-454e-9d52-fa95b47fb142';

export const sendVerifyOtp = async (otpData) => {
    try {
        const response = await axios.post(`${apiUrl}/send_verify_otp`, otpData, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};




export const debitZippyWallet = async (debitData) => {
    try {
        const response = await axios.post(`${apiUrl}/debit_zippywallet`, debitData, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error debiting Wallet:', error);
        throw error;
    }
};

