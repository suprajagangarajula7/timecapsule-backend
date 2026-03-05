const supabase = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");

// ================= CREATE =================
exports.createCapsule = async (req, res) => {

  const { 
    title, 
    message, 
    unlock_at, 
    images, 
    videos, 
    audios,
    is_public,
    password,
    latitude,
    longitude
  } = req.body;

  const { data, error } =
    await supabase
      .from("capsules")
      .insert([{
        title,
        message,
        unlock_at,
        images: images || [],
        videos: videos || [],
        audios: audios || [],
        user_id: req.user.id,
        is_locked: new Date() < new Date(unlock_at),
        share_token: uuidv4(),

        // 🔥 NEW FIELDS
        is_public: is_public || false,
        password: password && password.trim() !== "" ? password : null,
latitude: latitude !== "" && latitude !== undefined ? Number(latitude) : null,
longitude: longitude !== "" && longitude !== undefined ? Number(longitude) : null
      }])
      .select();

  if (error)
    return res.status(400).json(error);

  res.json(data);
};

// ================= GET ALL =================
exports.getCapsules = async (req,res)=>{

 const { data,error } =
  await supabase
   .from("capsules")
   .select("*")
   .eq("user_id",req.user.id)
   .order("created_at",{ascending:false});

 if(error)
   return res.status(400).json(error);

 const updated = data.map(capsule=>{
   const now = new Date();
   const unlockTime =
     new Date(capsule.unlock_at);

   return {
     ...capsule,
     is_locked: now < unlockTime
   };
 });

 res.json(updated);
};

// ================= GET SINGLE =================
// ================= GET SINGLE =================
exports.getSingleCapsule = async (req, res) => {

  const { id } = req.params;

  const { data, error } = await supabase
    .from("capsules")
    .select("*")
    .eq("id", id)
    .eq("user_id", req.user.id)
    .single();

  if (error || !data)
    return res.status(404)
      .json({ message: "Capsule not found" });

  const now = new Date();
  const unlockTime = new Date(data.unlock_at);

  const updatedCapsule = {
    ...data,
    is_locked: now < unlockTime
  };

  res.json(updatedCapsule);
};

// ================= DELETE =================
exports.deleteCapsule =
async (req,res)=>{

 const { id } = req.params;

 await supabase
   .from("capsules")
   .delete()
   .eq("id",id);

 res.json({message:"Capsule Deleted"});
};

// ================= SHARE =================
exports.getSharedCapsule =
async(req,res)=>{

 const { token } = req.params;

 const { data } =
   await supabase
     .from("capsules")
     .select("*")
     .eq("share_token",token)
     .single();

 if(!data)
   return res.status(404)
     .json({message:"Not found"});

 const now = new Date();
 const unlock =
   new Date(data.unlock_at);

 if(now < unlock)
   return res.json({
     locked:true,
     unlock_at:data.unlock_at
   });

 // 🔥 If private, block access
 if(!data.is_public){
   return res.json({
     locked:false,
     message:"This capsule is private"
   });
 }

 res.json({
   locked:false,
   capsule:data
 });
};