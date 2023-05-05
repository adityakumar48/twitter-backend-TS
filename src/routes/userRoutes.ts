import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Create User
router.post("/", async (req, res) => {
  const { email, name, username } = req.body;
  try {
    const result = await prisma.user.create({
      data: {
        email,
        name,
        username,
      },
    });
    res.status(201).json({ result });
  } catch (err) {
    res.status(400).json({ error: "Username or Email Should be Unique" });
  }
});

// list User
router.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

// Get One User
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });

  res.json(user);
});

// Update User
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { bio, name, image } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        bio,
        name,
        image,
      },
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Failed to Update User" });
  }

  res.status(501).json({ error: `Not Implemented: ${id}` });
});

// Delete User
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.user.delete({ where: { id: Number(id) } });

  res.sendStatus(200);
});

export default router;
