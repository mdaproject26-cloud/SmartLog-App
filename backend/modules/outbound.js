const supabase = require('../services/database');

const outboundModule = {
    // 1. Create Sales Order (SO)
    async createSO(soData) {
        const { customer_id, warehouse_id, reference_no, items } = soData;
        
        const { data: header, error: headerError } = await supabase
            .from('outbound_headers')
            .insert([{
                customer_id,
                warehouse_id,
                reference_no,
                status: 'Draft'
            }])
            .select()
            .single();

        if (headerError) throw headerError;

        const details = items.map(item => ({
            outbound_header_id: header.id,
            product_id: item.product_id,
            quantity: item.quantity,
            status: 'Pending'
        }));

        const { error: detailError } = await supabase
            .from('outbound_details')
            .insert(details);

        if (detailError) throw detailError;

        return header;
    },

    // 2. Picking (Allocate stock and record movement)
    async pickItems(headerId, pickData) {
        // pickData: { product_id, location_id, quantity, batch_no, user_id }
        const { product_id, location_id, quantity, batch_no, user_id, reference_no } = pickData;

        // A. Verify and Deduct Stock from 'inventory' table
        const { data: stock, error: fetchError } = await supabase
            .from('inventory')
            .select('*')
            .eq('product_id', product_id)
            .eq('location_id', location_id)
            .eq('batch_no', batch_no)
            .single();

        if (fetchError || !stock || stock.quantity < quantity) {
            throw new Error('Insufficient stock or invalid location');
        }

        // Update quantity (Subtract)
        const { error: updateError } = await supabase
            .from('inventory')
            .update({ quantity: stock.quantity - quantity })
            .eq('id', stock.id);

        if (updateError) throw updateError;

        // B. Record Movement Log
        const { error: logError } = await supabase
            .from('movement_logs')
            .insert([{
                product_id,
                from_location_id: location_id,
                quantity,
                transaction_type: 'Outbound',
                reference_no: reference_no,
                user_id
            }]);

        if (logError) throw logError;

        return { message: 'Picking completed and stock deducted' };
    },

    // Get Outbound list
    async getOutboundList() {
        const { data, error } = await supabase
            .from('outbound_headers')
            .select('*, customers(customer_name), warehouses(name)')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }
};

module.exports = outboundModule;
