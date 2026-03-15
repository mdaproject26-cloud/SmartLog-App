const supabase = require("../services/database");

const productModule = {
  // Get all products
  async getAllProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("product_name", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get single product by ID
  async getProductById(id) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new product
  async createProduct(productData) {
    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Update existing product
  async updateProduct(id, updateData) {
    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Delete product
  async deleteProduct(id) {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
    return { message: "Product deleted successfully" };
  },
};

module.exports = productModule;
