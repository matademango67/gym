import { gym_model } from "../model/gym_model.js";
import {Validar_customer,Validar_membership,Validar_payments} from "../middleware/gym_validation.js"

export class gym_controller {
    static async getCustomers (req,res){
        try {
            const customers = await gym_model.getCustomers();
            res.json(customers);
        } catch (error) {
            res.status(500).json({ error: error.message });
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
            res.status(500).json({ error: error.message });
        }
    }
    static async createCustomer (req,res){
        const result = Validar_customer(req.body);
        console.log(result);
        if (!result.success) {
            return res.status(400).json({ error: "Invalid input" });
        }
        try {
            const newCustomer = await gym_model.createCustomer(result.data);
            res.status(201).json(newCustomer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
} 

    static async deleteCustomer (req,res){
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: "id is required" });
        }
        try {
            const result = await gym_model.deleteCustomer(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        }

    static async UpdateCustomer (req,res){
        const { id } = req.params;
        const result = Validar_customer(req.body);
        if (!result.success) {
            return res.status(400).json({ error: "Invalid input" });
        } else if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }
        try {
            await gym_model.UpdateCustomer(id, result.data);
            res.json({ message: "Customer updated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
}  
}
