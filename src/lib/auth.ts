import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDb } from "./db";
import { ObjectId } from "mongodb";

export interface AuthUser {
  userId: string;
  username: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET env var");
  }
  return secret;
}

/**
 * Extracts and verifies JWT token from httpOnly cookie
 * Returns the authenticated user info or null if not authenticated
 */
export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  try {
    const token = req.cookies.get("social_token")?.value;
    
    if (!token) {
      return null;
    }

    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as { sub: string; username: string };
    
    if (!decoded.sub || !decoded.username) {
      return null;
    }

    // Optionally verify user still exists in database
    const db = await getDb();
    const user = await db.collection("users").findOne({ 
      _id: new ObjectId(decoded.sub) 
    });

    if (!user) {
      return null;
    }

    return {
      userId: decoded.sub,
      username: decoded.username,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to require authentication for API routes
 * Returns the authenticated user or sends 401 response
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  const user = await getAuthUser(req);
  
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  return { user };
}

