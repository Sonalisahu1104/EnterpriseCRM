import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://cttmoketmlhqrlpajxhn.supabase.co";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "sb_publishable_hnD-ijfuIYAeV_pAdMr4KQ_fnyZDvTq";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase URL or Anon Key missing in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
