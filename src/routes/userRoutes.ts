import express from "express";

const router = express.Router();
// Create User
router.post("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

// list User
router.get("/", (req, res) => {
  res.status(501).json({ error: "Not Implemented" });
});

// Get One User
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

// Update User
router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

// Delete User
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

export default router;
