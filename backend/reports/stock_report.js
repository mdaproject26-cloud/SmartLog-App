const supabase = require("../services/database");

const reportModule = {
  // 1. Get Stock Report (Current Snapshot)
  async getStockReport() {
    const { data, error } = await supabase.from("inventory").select(`
                quantity,
                batch_no,
                expiry_date,
                products (product_code, product_name, category, unit),
                locations (location_code),
                warehouses (name)
            `);

    if (error) throw error;
    return data;
  },

  // 2. Get Stock Movement Report (Historical)
  async getMovementReport(startDate, endDate) {
    let query = supabase
      .from("movement_logs")
      .select(
        `
                created_at,
                quantity,
                transaction_type,
                reference_no,
                products (product_code, product_name),
                from_location:locations!from_location_id (location_code),
                to_location:locations!to_location_id (location_code)
            `,
      )
      .order("created_at", { ascending: false });

    if (startDate && endDate) {
      query = query.gte("created_at", startDate).lte("created_at", endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // 3. Get Location Utilization
  async getLocationUtilization() {
    const { data, error } = await supabase
      .from("locations")
      .select("status", { count: "exact" });

    if (error) throw error;
    return data;
  },
};

module.exports = reportModule;
