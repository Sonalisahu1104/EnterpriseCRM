import { supabase } from "../supabaseClient";

/**
 * Service for interacting with Supabase tables and auth.
 */
const supabaseService = {
  // Example: Fetch all records from a table
  async getAll(tableName) {
    const { data, error } = await supabase.from(tableName).select("*");
    if (error) throw error;
    return data;
  },

  // Example: Fetch a single record by ID
  async getById(tableName, id) {
    const { data, error } = await supabase.from(tableName).select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  },

  // Example: Insert record(s) into a table
  async insert(tableName, payload) {
    const { data, error } = await supabase.from(tableName).insert(payload).select();
    if (error) throw error;
    return data;
  },

  // Example: Update a record by ID
  async update(tableName, id, payload) {
    const { data, error } = await supabase.from(tableName).update(payload).eq("id", id).select();
    if (error) throw error;
    return data;
  },

  // Example: Delete a record by ID
  async delete(tableName, id) {
    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

export default supabaseService;
