const Lead = require("../models/Lead");

// -------------------------
// CREATE LEAD
// -------------------------
const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
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

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    if (stage && stage !== "All") {
      filter.stage = stage;
    }

    const leads = await Lead.find(filter);
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
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------
// DELETE LEAD
// -------------------------
const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------
// DASHBOARD STATS (FIXED + SAFE)
// -------------------------
const getDashboardStats = async (req, res) => {
  try {
    const normalize = (s) => (s || "").toLowerCase();

    const leads = await Lead.find();

    const stats = {
      totalLeads: leads.length,
      newLeads: leads.filter(l => normalize(l.stage) === "new").length,
      contacted: leads.filter(l => normalize(l.stage) === "contacted").length,
      qualified: leads.filter(l => normalize(l.stage) === "qualified").length,
      won: leads.filter(l => normalize(l.stage) === "won").length,
      lost: leads.filter(l => normalize(l.stage) === "lost").length,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------
// EXPORT
// -------------------------
module.exports = {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getDashboardStats,
};