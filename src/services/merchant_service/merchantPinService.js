// services/pinService.js

import bcrypt from 'bcrypt';
import pool from "../../utils/db.js";

export const merchantPinService = {
    async createPIN(merchantId, pin) {
        // Validate PIN format
        const pinRegex = /^\d{4}$/;
        if (!pinRegex.test(pin)) {
            throw new Error('PIN must be exactly 4 digits');
        }

        try {
            // Hash the PIN
            const hashedPIN = await bcrypt.hash(pin, 10);

            // Update the hashed PIN for the merchant in the database
            const sql = 'UPDATE merchants SET pin = ? WHERE merchant_id = ?';
            await pool.execute(sql, [hashedPIN, merchantId]);
        } catch (error) {
            console.error(error); // Log the error for debugging
            throw new Error('Failed to update PIN');
        }
    }
};
