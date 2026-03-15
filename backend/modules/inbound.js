const supabase = require("../services/database");

const inboundModule = {
  // 1. Create Purchase Order (PO)
  async createPO(poData) {
    const { supplier_id, warehouse_id, reference_no, items } = poData;

    // Start transaction (via Supabase function or sequential calls)
    const { data: header, error: headerError } = await supabase
      .from("inbound_headers")
      .insert([
        {
          supplier_id,
          warehouse_id,
          reference_no,
          status: "Draft",
        },
      ])
      .select()
      .single();

    if (headerError) throw headerError;

    const details = items.map((item) => ({
      inbound_header_id: header.id,
      product_id: item.product_id,
      quantity: item.quantity,
      status: "Pending",
    }));

    const { error: detailError } = await supabase
      .from("inbound_details")
      .insert(details);

    if (detailError) throw detailError;

    return header;
  },

  // 2. Receiving (Update status to Received)
  async receiveItems(headerId, items) {
    // Update detail quantities and status
    for (const item of items) {
      const { error } = await supabase
        .from("inbound_details")
        .update({
          received_quantity: item.received_quantity,
          status: "Received",
        })
        .eq("id", item.detail_id);
      if (error) throw error;
    }

    // Update header status
    const { error: headerError } = await supabase
      .from("inbound_headers")
      .update({ status: "Received" })
      .eq("id", headerId);

    if (headerError) throw headerError;
    return { message: "Items received successfully" };
  },

  // 3. Putaway (Move to location and update inventory)
  async putaway(headerId, putawayData) {
    // This is where the Inventory Engine is triggered
    const {
      product_id,
      location_id,
      quantity,
      batch_no,
      expiry_date,
      user_id,
      warehouse_id,
    } = putawayData;

    // A. Check if inventory record exists for this product-location-batch
    const { data: existingStock, error: fetchError } = await supabase
      .from("inventory")
      .select("*")
      .eq("product_id", product_id)
      .eq("location_id", location_id)
      .eq("batch_no", batch_no)
      .single();

    if (existingStock) {
      // Update quantity
      const { error: updateError } = await supabase
        .from("inventory")
        .update({ quantity: existingStock.quantity + quantity })
        .eq("id", existingStock.id);
      if (updateError) throw updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase.from("inventory").insert([
        {
          product_id,
          location_id,
          quantity,
          batch_no,
          expiry_date,
          warehouse_id,
        },
      ]);
      if (insertError) throw insertError;
    }

    // B. Record Movement Log
    const { error: logError } = await supabase.from("movement_logs").insert([
      {
        product_id,
        to_location_id: location_id,
        quantity,
        transaction_type: "Inbound",
        reference_no: headerId,
        user_id,
      },
    ]);

    if (logError) throw logError;

    return { message: "Putaway completed" };
  },

  // Get Inbound list
  async getInboundList() {
    const { data, error } = await supabase
      .from("inbound_headers")
      .select("*, suppliers(supplier_name), warehouses(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};

module.exports = inboundModule;
