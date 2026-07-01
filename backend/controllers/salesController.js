const supabase = require("../config/supabase");

// Create Sale in Supabase
const createSale = async (req, res) => {
  try {
    const { customerName, customerEmail, amount, status, leadId } = req.body;
    const { data, error } = await supabase
      .from("sales")
      .insert([{ customerName, customerEmail, amount: Number(amount) || 0, status: status || "Closed", leadId }])
      .select();

    if (error) throw error;
    res.json({ ...data[0], _id: data[0].id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all sales from Supabase
const getSales = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    const sales = (data || []).map((s) => ({ ...s, _id: s.id }));
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get total revenue from Supabase
const getRevenue = async (req, res) => {
  try {
    const { data, error } = await supabase.from("sales").select("amount");
    if (error) throw error;

    const total = (data || []).reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
    res.json({ totalRevenue: total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSale,
  getSales,
  getRevenue,
};