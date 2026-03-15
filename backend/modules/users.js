const supabase = require("../services/database");

const userModule = {
  // Get all users from the 'users' table
  async getAllUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create a new user (Note: In a real app, this should involve Supabase Auth SignUp)
  async createUser(userData) {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Update user role or status
  async updateUser(id, updateData) {
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },
};

module.exports = userModule;
