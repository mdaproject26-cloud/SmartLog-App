const supabase = require('../services/database');

const inventoryModule = {
    // Get all inventory (current stock)
    async getInventory() {
        const { data, error } = await supabase
            .from('inventory')
            .select(`
                id,
                quantity,
                batch_no,
                expiry_date,
                products (product_code, product_name, unit),
                locations (location_code),
                warehouses (name)
            `)
            .order('updated_at', { ascending: false });
        
        if (error) throw error;
        return data;
    },

    // Record stock movement (The core of Inventory Engine)
    async recordMovement(movementData) {
        const { product_id, from_location_id, to_location_id, quantity, transaction_type, reference_no, user_id } = movementData;

        // 1. Insert into movement_logs
        const { data: logData, error: logError } = await supabase
            .from('movement_logs')
            .insert([{
                product_id,
                from_location_id,
                to_location_id,
                quantity,
                transaction_type,
                reference_no,
                user_id
            }])
            .select();

        if (logError) throw logError;

        // 2. Update current stock in 'inventory' table
        // Logic depends on transaction type:
        // Inbound: Add to 'to_location'
        // Outbound: Subtract from 'from_location'
        // Transfer: Subtract from 'from' and Add to 'to'

        // For simplicity in this step, we just record the log.
        // In the next step (Transactions), we will implement the full stock update logic.
        
        return logData[0];
    }
};

module.exports = inventoryModule;
