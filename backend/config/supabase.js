const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || "https://cttmoketmlhqrlpajxhn.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || "sb_publishable_hnD-ijfuIYAeV_pAdMr4KQ_fnyZDvTq";

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ Supabase URL or Key missing in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

console.log("✅ Supabase Client Initialized");

module.exports = supabase;
