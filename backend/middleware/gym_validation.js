import { z } from "zod";

const customers = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "Name is required").max(30, "Name must be less than 100 characters"),
    birth: z.string().refine(
        (date) => !isNaN(Date.parse(date)),
        "Birth date must be a valid date (YYYY-MM-DD)"
    ).transform((date) => new Date(date)).refine(
        (date) => date >= new Date("1935-01-01") && date <= new Date("2011-01-01"),
        "Birth date must be between 1935-01-01 and 2011-01-01 (customer must be 15+ years old)"
    )
});

const membership = z.object({
    customer_id: z.string().uuid(),
    type: z.enum(["normal","vip"]),
    status: z.enum(["active", 'expired', 'banned', 'paused']).optional(),
});

 function Validar_customer(object){
     return customers.safeParse(object)
}

 function Validar_membership(object){
     return membership.safeParse(object)
}

 export function validateCustomerMiddleware(req,res,next){
    const result = Validar_customer(req.body);
    if(!result.success){
        //flatten es para que el mensaje de error se vea mejor(basicamente)
        return res.status(400).json({ error: result.error.flatten()})
    }
    next()
 }

  export function validateMembershipMiddleware(req,res,next){
    const result = Validar_membership(req.body);
    if(!result.success){
        //flatten es para que el mensaje de error se vea mejor(basicamente)
        return res.status(400).json({ error: result.error.flatten()})
    }
    next()
 }