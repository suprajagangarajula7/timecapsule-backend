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
      lastName
    } = req.body;

    /* CHECK EXISTING USER */
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
          firstname: firstName,
          lastname: lastName
        }])
        .select()
        .single();

    if (error)
      return res.status(400).json(error);

    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: newUser
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error"
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
        message: "User not found"
      });

    const valid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!valid)
      return res.status(401).json({
        message: "Wrong password"
      });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user
    });

  } catch {
    res.status(500).json({
      message: "Server error"
    });
  }
};


/* ================= GET USER ================= */
exports.getMe = async (req, res) => {

  try {

    const { data, error } =
      await supabase
        .from("users")
        .select("id,email,firstname,lastname")
        .eq("id", req.user.id)
        .single();

    if (error)
      return res.status(400).json(error);

    /* ✅ SEND FRONTEND FORMAT */
    res.json({
      id: data.id,
      email: data.email,
      firstName: data.firstname,
      lastName: data.lastname
    });

  } catch {
    res.status(500).json({
      message: "Server error"
    });
  }
};

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {

  try {

    const {
      firstName,
      lastName,
      email,
      password
    } = req.body;

    let updates = {};

    /* UPDATE NAME */
    if(firstName)
      updates.firstname = firstName;

    if(lastName)
      updates.lastname = lastName;

    /* UPDATE EMAIL */
    if(email)
      updates.email = email;

    /* UPDATE PASSWORD */
    if(password && password.trim() !== ""){

      const hashedPassword =
        await bcrypt.hash(password,10);

      updates.password = hashedPassword;
    }

    const { data, error } =
      await supabase
        .from("users")
        .update(updates)
        .eq("id", req.user.id)
        .select()
        .single();

    if(error)
      return res.status(400).json(error);

    res.json({
      id: data.id,
      email: data.email,
      firstName: data.firstname,
      lastName: data.lastname
    });

  } catch {

    res.status(500).json({
      message:"Server error"
    });

  }

};