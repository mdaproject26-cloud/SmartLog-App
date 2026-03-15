const supabase = require('../services/database');

const supplierModule = {
    // Get all suppliers
    async getAllSuppliers() {
        const { data, error } = await supabase
            .from('suppliers')
            .select('*')
            .order('supplier_name', { ascending: true });
        
        if (error) throw error;
        return data;
    },

    // Create new supplier
    async createSupplier(supplierData) {
        const { data, error } = await supabase
            .from('suppliers')
            .insert([supplierData])
            .select();
        
        if (error) throw error;
        return data[0];
    },

    // Update supplier
    async updateSupplier(id, updateData) {
        const { data, error } = await supabase
            .from('suppliers')
            .update(updateData)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    },

    // Delete supplier
    async deleteSupplier(id) {
        const { error } = await supabase
            .from('suppliers')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return { message: 'Supplier deleted successfully' };
    }
};

module.exports = supplierModule;
