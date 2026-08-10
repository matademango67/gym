import jwt from "jsonwebtoken";

export function createTestToken(user, overrides = {}) {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
            ...overrides
        },
        process.env.ACCESS_TOKEN_SECRET
    );
}