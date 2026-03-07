const supabase = require("../config/supabase");

exports.getPosts = async (req, res) => {
  const { data, error } = await supabase.from("posts").select("*");
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content, owner_id: req.user.userId })
    .select();
  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data);
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { userId, role } = req.user;

  // ดึง post มาเช็ค owner
  const { data: post } = await supabase
    .from("posts").select("owner_id").eq("id", id).single();

  if (!post) return res.status(404).json({ message: "Post not found" });

  // ✅ Ownership check
  if (post.owner_id !== userId && role !== "admin") {
    return res.status(403).json({ message: "You do not own this post" });
  }

  const { data, error } = await supabase
    .from("posts").update({ title, content }).eq("id", id).select();
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

