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
    ),
    email: z.string().email("Invalid email address"),
});

const membership = z.object({
    id: z.string().uuid(),
    customer_id: z.string().uuid(),
    type: z.enum(["normal","vip"]),
    expire: z.date().min(new Date(), "Expiration date must be in the future"),
    start: z.date().max(new Date(), "Start date cannot be in the future"),
    status: z.enum(["active", 'expired', 'banned', 'paused']),
    }).refine(
    (data) => data.expire > data.start,
    {
        message: "Expire date must be after start date",
        path: ["expire"]
    }
);

const payments = z.object({
    id: z.string().uuid(),
    customer_id: z.string().uuid(),
    amount: z.number().positive("the amount of the payment must be a positive number"),
    time: z.date().max(new Date(), "Start date cannot be in the future")
});

export function Validar_customer(object){
     return customers.safeParse(object)
}

export function Validar_membership(object){
     return membership.safeParse(object)
}

export function Validar_payments(object){
     return payments.safeParse(object)
}