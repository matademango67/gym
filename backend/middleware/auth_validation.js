import {z} from "zod";

const userSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long")
});

const updateSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    new_email: z.string().email("Invalid email address").optional(),
    new_password: z.string().min(6, "Password must be at least 6 characters long").optional()
});

 function validateUser(body) {
    return userSchema.safeParse(body);
}   

 function validateUpdate(body) {
    return updateSchema.safeParse(body);
}

export function validateUserMiddleware(req,res,next){
    const result = validateUser(req.body);
    if (!result.success){
        return res.status(400).json({ error: result.error.flatten()})
    }
    next();
}

export function validateUpdateMiddleware(req, res, next) {
    const result = validateUpdate(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.flatten() });
    }
    next();
}