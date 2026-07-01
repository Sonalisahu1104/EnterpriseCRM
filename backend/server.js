require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const supabase = require("./config/supabase");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/sales", require("./routes/salesRoutes"));

app.get("/", async (req, res) => {
  res.json({
    status: "CRM Backend Running",
    database: "MongoDB Connected",
    supabase: "Connected to project cttmoketmlhqrlpajxhn",
  });
});

// IMPORTANT: use environment variable for production
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });
  })
  .catch((err) => console.log(err));