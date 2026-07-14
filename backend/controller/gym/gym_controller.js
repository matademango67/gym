import { gym_model } from "../../model/gym/gym_model.js";

export class gym_controller {
    static async getCustomers (req,res){
        const user_id = req.user.id
        try {
            const customers = await gym_model.getCustomers(user_id);
            res.json(customers);
        } catch (error) {
           return res.status(500).json({ error: error.message });
        }
    }

    static async getAllCustomers (req,res){
        try {
            const customers = await gym_model.getAllCustomers();
            res.json(customers);
        } catch (error) {
           return res.status(500).json({ error: error.message });
        }
    }

    static async SearchCustomer (req,res){
        const { search } = req.params;
        try {
            const customer = await gym_model.SearchCustomer(search);
            if (customer) {
                res.json(customer);
            } else {
                res.status(404).json({ error: "Customer not found" });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async createCustomer (req,res){
        const user_id = req.user.id
        const input = req.body
        try {
            const newCustomer = await gym_model.createCustomer(input,user_id);
            res.status(201).json(newCustomer);
        } catch (error) {
          return  res.status(500).json({ error: error.message });
        }
} 

    static async UpdateCustomer (req,res){
        const user_id = req.user.id
        const input = req.body;
        try {
            await gym_model.UpdateCustomer(user_id,input);
            res.json({ message: "Customer updated successfully" });
        } catch (error) {
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            error: error.message
        });
    }

    return res.status(500).json({
        error: error.message
    });}}
}
