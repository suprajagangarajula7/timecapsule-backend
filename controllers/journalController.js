const supabase = require("../config/supabaseClient");

// ================= CREATE ENTRY =================
exports.createEntry = async (req, res) => {

  const { title, content } = req.body;

  const { data, error } = await supabase
    .from("journal_entries")
    .insert([{
      title,
      content,
      user_id: req.user.id
    }])
    .select();

  if (error) return res.status(400).json(error);

  res.json(data);
};


// ================= GET ALL ENTRIES =================
exports.getEntries = async (req, res) => {

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json(error);

  res.json(data);
};


// ================= GET SINGLE ENTRY =================
exports.getSingleEntry = async (req, res) => {

  const { id } = req.params;

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", req.user.id)
    .single();

  if (error || !data)
    return res.status(404).json({ message: "Entry not found" });

  res.json(data);
};


// ================= DELETE ENTRY =================
exports.deleteEntry = async (req, res) => {

  const { id } = req.params;

  await supabase
    .from("journal_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id);

  res.json({ message: "Journal entry deleted" });
};