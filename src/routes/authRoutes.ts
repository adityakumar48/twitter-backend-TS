import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const EMAIL_EXPIRATION_TIME = 10;
const AUTHENTICATION_EXPIRATION_TIME_HOURS = 12;
const JWT_SECRET = "THISISMYJWTSECRET";
const router = express.Router();
const prisma = new PrismaClient();

function generateEmailToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateAuthToken(tokenId: number): string {
  const jwtPayload = { tokenId };

  return jwt.sign(jwtPayload, JWT_SECRET, { noTimestamp: true });
}

// Craete a user, if doen't exist,
// generate a token and send it back to their email
router.post("/login", async (req, res) => {
  const { email } = req.body;

  try {
    // Generate a token
    const emailToken = generateEmailToken();
    const expiration = new Date(
      new Date().getTime() + EMAIL_EXPIRATION_TIME * 60 * 1000
    );

    const createdToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
      },
    });

    console.log(createdToken);

    //   Send Mail Token to users email
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
  }
});

// Validate the emailToken
// Generate a long JWT TOken
router.post("/authenticate", async (req, res) => {
  const { email, emailToken } = req.body;

  const dbEmailToken = await prisma.token.findUnique({
    where: { emailToken },
    include: { user: true },
  });

  if (!dbEmailToken || !dbEmailToken.valid) return res.sendStatus(401);

  if (dbEmailToken.expiration < new Date()) {
    return res.status(401).json({ error: "Token expired" });
  }

  if (dbEmailToken?.user?.email !== email) {
    return res.sendStatus(401);
  }

  //   validated

  //   Generate an API Token
  const expiration = new Date(
    new Date().getTime() + AUTHENTICATION_EXPIRATION_TIME_HOURS * 60 * 60 * 1000
  );

  const apiToken = await prisma.token.create({
    data: {
      type: "API",
      expiration,
      user: {
        connect: {
          email,
        },
      },
    },
  });

  //   Invalidate the email
  await prisma.token.update({
    where: { id: dbEmailToken.id },
    data: { valid: false },
  });

  //   Generate JWT Token
  const authToken = generateAuthToken(apiToken.id);

  res.json({ authToken });
});

export default router;
