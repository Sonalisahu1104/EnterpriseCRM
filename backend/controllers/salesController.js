const supabase = require("../config/supabase");

// Create Sale in Supabase
const createSale = async (req, res) => {
  try {
    const { customerName, customerEmail, amount, status, leadId } = req.body;
    
    // Support both camelCase and PostgreSQL lowercase column names
    const salePayload = {
      customername: customerName,
      customeremail: customerEmail,
      amount: Number(amount) || 0,
      status: status || "Closed",
      leadid: leadId,
    };

    const { data, error } = await supabase
      .from("sales")
      .insert([salePayload])
      .select();

    if (error) throw error;
    
    const s = data[0];
    res.json({
      ...s,
      _id: s.id,
      customerName: s.customerName || s.customername,
      customerEmail: s.customerEmail || s.customeremail,
      leadId: s.leadId || s.leadid,
    });
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
    
    const sales = (data || []).map((s) => ({
      ...s,
      _id: s.id,
      customerName: s.customerName || s.customername,
      customerEmail: s.customerEmail || s.customeremail,
      leadId: s.leadId || s.leadid,
    }));
    
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