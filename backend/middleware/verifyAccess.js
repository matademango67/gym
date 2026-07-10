import {pool} from "../db/gym.js";

export const verifyAccess = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const user_id = req.user.id;

    const access = await pool.query(
        "SELECT status FROM users WHERE id = $1",
        [user_id]
    );

    if (access.rows.length === 0) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (access.rows[0].status !== "active") {
        return res.status(403).json({
            message: "Access denied because your account is not active. Please contact the administrator."
        });
    }

    next();
};