import cron from 'node-cron';
import {pool} from "../db/gym.js";

cron.schedule('0 0 * * *', async () => {
    try {
        await pool.query(`
            UPDATE memberships
            SET status = 'expired'
            WHERE expire < CURRENT_DATE
            AND status = 'active'
        `);

        console.log('Expired memberships updated');
    } catch (error) {
        console.error('Cron job error:', error);
    }
});