const supabase = require("../config/supabase");

// -------------------------
// CREATE LEAD
// -------------------------
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, stage } = req.body;
    const { data, error } = await supabase
      .from("leads")
      .insert([{ name, email, phone, company, stage: stage || "New" }])
      .select();

    if (error) throw error;
    const lead = { ...data[0], _id: data[0].id };
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------
// GET ALL LEADS (SEARCH + FILTER)
// -------------------------
const getLeads = async (req, res) => {
  try {
    const { search, stage } = req.query;

    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (stage && stage !== "All") {
      query = query.eq("stage", stage);
    }

    const { data, error } = await query;
    if (error) throw error;

    let leads = (data || []).map((item) => ({ ...item, _id: item.id }));

    if (search) {
      const term = search.toLowerCase();
      leads = leads.filter(
        (l) =>
          (l.name && l.name.toLowerCase().includes(term)) ||
          (l.email && l.email.toLowerCase().includes(term)) ||
          (l.company && l.company.toLowerCase().includes(term))
      );
    }

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------
// UPDATE LEAD
// -------------------------
const updateLead = async (req, res) => {
  try {
    const id = req.params.id;
    const { _id, id: removeId, created_at, updated_at, ...updateData } = req.body;

    const { data, error } = await supabase
      .from("leads")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ ...data[0], _id: data[0].id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------
// DELETE LEAD
// -------------------------
const deleteLead = async (req, res) => {
  try {
    const id = req.params.id;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) throw error;

    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------
// DASHBOARD STATS
// -------------------------
const getDashboardStats = async (req, res) => {
  try {
    const { data: leads, error } = await supabase.from("leads").select("stage");
    if (error) throw error;

    const normalize = (s) => (s || "").toLowerCase();
    const list = leads || [];

    const stats = {
      totalLeads: list.length,
      newLeads: list.filter((l) => normalize(l.stage) === "new").length,
      contacted: list.filter((l) => normalize(l.stage) === "contacted").length,
      qualified: list.filter((l) => normalize(l.stage) === "qualified").length,
      won: list.filter((l) => normalize(l.stage) === "won").length,
      lost: list.filter((l) => normalize(l.stage) === "lost").length,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getDashboardStats,
};