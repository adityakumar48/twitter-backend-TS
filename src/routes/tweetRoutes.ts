import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Tweet CRUD

// Create Tweet
router.post("/", async (req, res) => {
  const { content, image, userId } = req.body;
  try {
    const result = await prisma.tweet.create({
      data: {
        content,
        image,
        userId,
      },
    });
    res.status(201).json({ result });
  } catch (err) {
    res.status(400).json({ error: "Username or Email Should be Unique" });
  }
});

// list Tweet
router.get("/", async (req, res) => {
  const allTweets = await prisma.tweet.findMany({ include: { user: true } });
  res.json(allTweets);
});

// Get One Tweet
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const tweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });
  if (!tweet) return res.status(404).json({ error: "Tweet not found" });
  res.json(tweet);
});

// Update Tweet
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

// Delete Tweet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.tweet.delete({ where: { id: Number(id) } });

  res.sendStatus(200);
});

export default router;
