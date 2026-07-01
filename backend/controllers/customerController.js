const supabase = require("../config/supabase");

// Convert Lead → Customer in Supabase
const convertToCustomer = async (req, res) => {
  try {
    const leadId = req.params.id;
    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError || !leadData) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const newCustomer = {
      name: leadData.name,
      email: leadData.email,
      company: leadData.company,
      sourceLeadId: leadData.id,
    };

    const { data: customerData, error: custError } = await supabase
      .from("customers")
      .insert([newCustomer])
      .select();

    if (custError) throw custError;

    res.json({
      message: "Converted to customer",
      customer: { ...customerData[0], _id: customerData[0].id },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all customers from Supabase
const getCustomers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    const customers = (data || []).map((c) => ({ ...c, _id: c.id }));
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete customer from Supabase
const deleteCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) throw error;

    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  convertToCustomer,
  getCustomers,
  deleteCustomer,
};