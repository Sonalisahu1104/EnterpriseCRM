const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
// REGISTER USER
// =======================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists in Supabase
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in Supabase
    const { data: user, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: "User registered successfully",
      user: { ...user[0], _id: user[0].id },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// LOGIN USER
// =======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Demo login check first
    if (email === "test@gmail.com" && password === "123456") {
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET || "enterprisecrm123",
        { expiresIn: "1d" }
      );

      return res.json({ token });
    }

    // Check Supabase database for registered users
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET || "enterprisecrm123",
      { expiresIn: "1d" }
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};