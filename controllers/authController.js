const supabase = require("../config/supabaseClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {

    const {
      email,
      password,
      firstName,
      lastName,
      phone
    } = req.body;

    /* CHECK USER */
    const { data: existingUser } =
      await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    /* HASH PASSWORD */
    const hashedPassword =
      await bcrypt.hash(password, 10);

    /* INSERT USER */
    const { data: newUser, error } =
      await supabase
        .from("users")
        .insert([{
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone
        }])
        .select()
        .single();

    if (error)
      return res.status(400).json(error);

    /* TOKEN */
    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "User registered successfully",
      token,
      user: newUser,
    });

  } catch {
    res.status(500).json({
      message: "Server error",
    });
  }
};


/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const { data: user } =
      await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const valid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!valid)
      return res.status(401).json({
        message: "Wrong password",
      });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });

  } catch {
    res.status(500).json({
      message: "Server error",
    });
  }
};


/* ================= GET LOGGED USER ================= */
exports.getMe = async (req, res) => {

  try {

    const { data, error } =
      await supabase
        .from("users")
        .select(
          "id,email,firstName,lastName,phone"
        )
        .eq("id", req.user.id)
        .single();

    if (error)
      return res.status(400).json(error);

    res.json(data);

  } catch {
    res.status(500).json({
      message: "Server error"
    });
  }
};