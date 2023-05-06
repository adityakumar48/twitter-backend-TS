import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = "THISISMYJWTSECRET";

type AuthRequest = Request & { user?: User };

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];

  const jwtToken = authHeader?.split(" ")[1];

  if (!jwtToken) return res.status(401).json({ error: "Unauthorized" });

  // Decode the token

  try {
    const payload = (await jwt.verify(jwtToken, JWT_SECRET)) as {
      tokenId: number;
    };
    if (!payload?.tokenId) return res.sendStatus(401);
    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: { user: true },
    });

    if (!dbToken?.valid || dbToken.expiration < new Date()) {
      return res.status(401).json({ error: "Api token not valid" });
    }

    req.user = dbToken.user;
  } catch (error) {
    return res.sendStatus(401);
  }

  next();
}
