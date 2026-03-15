const supabase = require("../services/database");

const locationModule = {
  // Get all locations
  async getAllLocations() {
    const { data, error } = await supabase
      .from("locations")
      .select("*, warehouses(name)")
      .order("location_code", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create new location
  async createLocation(locationData) {
    const { data, error } = await supabase
      .from("locations")
      .insert([locationData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Update location
  async updateLocation(id, updateData) {
    const { data, error } = await supabase
      .from("locations")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Delete location
  async deleteLocation(id) {
    const { error } = await supabase.from("locations").delete().eq("id", id);

    if (error) throw error;
    return { message: "Location deleted successfully" };
  },
};

module.exports = locationModule;
