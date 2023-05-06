import jwt from "jsonwebtoken";
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "THISISMYJWTSECRET";
// Tweet CRUD

// Create Tweet
router.post("/", async (req, res) => {
  const { content, image } = req.body;
  // @ts-ignore
  const user = req.user;

  res.sendStatus(200);
  try {
    const result = await prisma.tweet.create({
      data: {
        content,
        image,
        userId: user.id,
      },
    });
    res.status(201).json({ result });
  } catch (err) {
    res.status(400).json({ error: "Username or Email Should be Unique" });
  }
});

// list Tweet
router.get("/", async (req, res) => {
  const allTweets = await prisma.tweet.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });
  res.json(allTweets);
});

// Get One Tweet
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });
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
