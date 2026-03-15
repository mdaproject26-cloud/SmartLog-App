const supabase = require("../services/database");

const customerModule = {
  // Get all customers
  async getAllCustomers() {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("customer_name", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create new customer
  async createCustomer(customerData) {
    const { data, error } = await supabase
      .from("customers")
      .insert([customerData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Update customer
  async updateCustomer(id, updateData) {
    const { data, error } = await supabase
      .from("customers")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Delete customer
  async deleteCustomer(id) {
    const { error } = await supabase.from("customers").delete().eq("id", id);

    if (error) throw error;
    return { message: "Customer deleted successfully" };
  },
};

module.exports = customerModule;
