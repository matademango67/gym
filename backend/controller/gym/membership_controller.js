import { Membership_model } from "../../model/gym/membership_model.js";

export class gym_membership {
    static async get_memberships(req,res){
        try{
          const memberships = await Membership_model.get_memberships()
          res.status(200).json(memberships)
        } catch (error){
            return res.status(500).json({ error : error.message})
        }      
    }
    static async search_memberships(req,res){
        const {customer_id} = req.params;
        try{
            const membership = await Membership_model.search_membership(customer_id)
            if(membership){
               res.status(200).json(membership)
            } else {
                return res.status(404).json({error: "membership not found"})
            }
            
        } catch (error){
            return res.status(500).json({error: error.message})
        } 

    }
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
}

 static async paused_membership (req,res){
   const user_id = req.user.id;

try {
  const result = await Membership_model.paused_membership(user_id);
  res.status(200).json(result);
} catch (error) {
  console.error(error);

  if (error.message === "Customer not found" || error.message === "Membership not found") {
    return res.status(404).json({ message: error.message });
  }

  if (error.message.includes("can't pause")) {
    return res.status(400).json({ message: error.message });
  }

  res.status(500).json({ message: "Something went wrong pausing the membership" });
}
 }}

