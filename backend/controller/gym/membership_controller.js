import { Membership_model } from "../../model/gym/membership_model.js";

export class gym_membership {
    static async create_membership (req,res){
        const input = req.body;
        try {
            const newMembership = await Membership_model.create_membership(input);
            res.status(201).json(newMembership);
        } catch (error) {

    if (error.statusCode === 409) {
        return res.status(409).json({
            error: error.message
        });
    }

    return res.status(500).json({
        error: error.message
    });
}
}}

