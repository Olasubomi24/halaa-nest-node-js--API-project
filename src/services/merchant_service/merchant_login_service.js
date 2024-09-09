// services/merchantLoginService.js

import bcrypt from 'bcrypt';
import pool from "../../utils/db.js";

export const merchantLoginService = {
    async login(zippy_wallet_number, pin) {
        try {
            // Retrieve the hashed PIN for the merchant from the database
            const [merchant] = await pool.query('SELECT pin FROM merchants WHERE zippy_wallet_number = ?', [zippy_wallet_number]);

            // If no merchant found with the given wallet number, throw error
            if (!merchant || merchant.length === 0) {
                throw new Error('Merchant not found');
            }

            const hashedPINFromDB = merchant[0].pin;

            // Compare the hashed PIN from the database with the hashed version of the entered PIN
            const match = await bcrypt.compare(pin, hashedPINFromDB);

            if (!match) {
                throw new Error('Invalid PIN');
            }

            // Return success response
            return { status_code: 0, message: 'Login successful' };
        } catch (error) {
            // Log the error for debugging
            console.error(error);
            // Re-throw the error to propagate specific error messages
            throw error;
        }
    }
};
